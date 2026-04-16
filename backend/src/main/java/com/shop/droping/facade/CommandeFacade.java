package com.shop.droping.facade;

import com.shop.droping.domain.Commande;
import com.shop.droping.domain.Configuration;
import com.shop.droping.domain.LigneCommande;
import com.shop.droping.domain.Produit;
import com.shop.droping.enums.StatutCommande;
import com.shop.droping.presentation.dto.CommandeDto;
import com.shop.droping.presentation.dto.CreerCommandeRequest;
import com.shop.droping.presentation.dto.WhatsAppLinkDto;
import com.shop.droping.repository.CommandeRepository;
import com.shop.droping.repository.ConfigurationRepository;
import com.shop.droping.repository.ProduitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class CommandeFacade {

    private final CommandeRepository commandeRepository;
    private final ProduitRepository produitRepository;
    private final ConfigurationRepository configurationRepository;

    public CommandeFacade(CommandeRepository commandeRepository,
                         ProduitRepository produitRepository,
                         ConfigurationRepository configurationRepository) {
        this.commandeRepository = commandeRepository;
        this.produitRepository = produitRepository;
        this.configurationRepository = configurationRepository;
    }

    public List<CommandeDto> listerToutesLesCommandes() {
        return commandeRepository.findAll()
            .stream()
            .map(CommandeDto::fromEntity)
            .toList();
    }

    public List<CommandeDto> listerParStatut(StatutCommande statut) {
        return commandeRepository.findByStatut(statut)
            .stream()
            .map(CommandeDto::fromEntity)
            .toList();
    }

    public CommandeDto trouverParId(Long id) {
        return commandeRepository.findByIdWithLignes(id)
            .map(CommandeDto::fromEntity)
            .orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'ID: " + id));
    }

    public CommandeDto trouverParNumero(String numero) {
        return commandeRepository.findByNumeroWithLignes(numero)
            .map(CommandeDto::fromEntity)
            .orElseThrow(() -> new RuntimeException("Commande non trouvée avec le numéro: " + numero));
    }

    @Transactional
    public CommandeDto creerCommande(CreerCommandeRequest request) {
        Commande commande = new Commande();
        commande.setNumero(genererNumeroCommande());
        commande.setClientNom(request.clientNom());
        commande.setClientTelephone(request.clientTelephone());
        commande.setClientEmail(request.clientEmail());
        commande.setClientAdresse(request.clientAdresse());
        commande.setNotes(request.notes());
        commande.setStatut(StatutCommande.EN_ATTENTE);
        commande.setWhatsappMessageSent(false);

        // Ajouter les lignes de commande
        for (CreerCommandeRequest.LigneRequest ligneRequest : request.lignes()) {
            Produit produit = produitRepository.findById(ligneRequest.produitId())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé: " + ligneRequest.produitId()));

            BigDecimal prixUnitaire = produit.getPrixEffectif();
            LigneCommande ligne = new LigneCommande(
                produit,
                ligneRequest.taille(),
                ligneRequest.quantite(),
                prixUnitaire
            );
            ligne.setCouleur(ligneRequest.couleur() != null ? ligneRequest.couleur() : "Standard");
            ligne.setBadgesOfficiels(Boolean.TRUE.equals(ligneRequest.badgesOfficiels()));
            ligne.setFlocage(Boolean.TRUE.equals(ligneRequest.flocage()));
            ligne.setFlocageNom(ligneRequest.flocageNom());
            ligne.setFlocageNumero(ligneRequest.flocageNumero());
            ligne.setPrixOptionsUnitaire(ligneRequest.prixOptionsUnitaire() != null ? ligneRequest.prixOptionsUnitaire() : BigDecimal.ZERO);
            ligne.calculerPrixTotal();
            commande.addLigne(ligne);
        }

        commande.calculerMontantTotal();

        return CommandeDto.fromEntity(commandeRepository.save(commande));
    }

    @Transactional
    public CommandeDto mettreAJourStatut(Long id, StatutCommande nouveauStatut) {
        Commande commande = commandeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'ID: " + id));

        commande.setStatut(nouveauStatut);
        return CommandeDto.fromEntity(commandeRepository.save(commande));
    }

    @Transactional
    public WhatsAppLinkDto genererLienWhatsApp(Long commandeId) {
        Commande commande = commandeRepository.findByIdWithLignes(commandeId)
            .orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'ID: " + commandeId));

        String numeroWhatsApp = configurationRepository.findByCle(Configuration.CLE_WHATSAPP_NUMERO)
            .map(Configuration::getValeur)
            .orElse("+22900000000");

        String nomBoutique = configurationRepository.findByCle(Configuration.CLE_NOM_BOUTIQUE)
            .map(Configuration::getValeur)
            .orElse("Shop Droping");

        String devise = configurationRepository.findByCle(Configuration.CLE_DEVISE)
            .map(Configuration::getValeur)
            .orElse("FCFA");

        // Construire le message
        StringBuilder message = new StringBuilder();
        message.append("🛒 *Nouvelle commande ").append(nomBoutique).append("*\n\n");
        message.append("📋 *Numéro:* ").append(commande.getNumero()).append("\n");
        message.append("👤 *Client:* ").append(commande.getClientNom()).append("\n");
        message.append("📞 *Téléphone:* ").append(commande.getClientTelephone()).append("\n");

        if (commande.getClientAdresse() != null && !commande.getClientAdresse().isEmpty()) {
            message.append("📍 *Adresse:* ").append(commande.getClientAdresse()).append("\n");
        }

        message.append("\n*Articles commandés:*\n");
        for (LigneCommande ligne : commande.getLignes()) {
            message.append("• ").append(ligne.getProduit().getNom())
                   .append(" (").append(ligne.getTaille()).append(")")
                   .append(" - ").append(ligne.getCouleur())
                   .append(" x").append(ligne.getQuantite())
                   .append(" - ").append(ligne.getPrixTotal()).append(" ").append(devise).append("\n");

            if (Boolean.TRUE.equals(ligne.getBadgesOfficiels())) {
                message.append("   + Badges officiels\n");
            }

            if (Boolean.TRUE.equals(ligne.getFlocage())) {
                message.append("   + Flocage");
                if (ligne.getFlocageNom() != null && !ligne.getFlocageNom().isBlank()) {
                    message.append(" nom: ").append(ligne.getFlocageNom());
                }
                if (ligne.getFlocageNumero() != null && !ligne.getFlocageNumero().isBlank()) {
                    message.append(" numero: ").append(ligne.getFlocageNumero());
                }
                message.append("\n");
            }
        }

        message.append("\n💰 *Total:* ").append(commande.getMontantTotal()).append(" ").append(devise);

        if (commande.getNotes() != null && !commande.getNotes().isEmpty()) {
            message.append("\n\n📝 *Notes:* ").append(commande.getNotes());
        }

        // Marquer comme envoyé
        commande.setWhatsappMessageSent(true);
        commandeRepository.save(commande);

        return WhatsAppLinkDto.creer(numeroWhatsApp, message.toString());
    }

    public WhatsAppLinkDto genererLienWhatsAppPanier(List<CreerCommandeRequest.LigneRequest> lignes,
                                                     String clientNom, String clientTelephone) {
        String numeroWhatsApp = configurationRepository.findByCle(Configuration.CLE_WHATSAPP_NUMERO)
            .map(Configuration::getValeur)
            .orElse("+22900000000");

        String nomBoutique = configurationRepository.findByCle(Configuration.CLE_NOM_BOUTIQUE)
            .map(Configuration::getValeur)
            .orElse("Shop Droping");

        String devise = configurationRepository.findByCle(Configuration.CLE_DEVISE)
            .map(Configuration::getValeur)
            .orElse("FCFA");

        StringBuilder message = new StringBuilder();
        message.append("Bonjour, je souhaite commander les articles suivants chez *").append(nomBoutique).append("*:\n\n");

        BigDecimal total = BigDecimal.ZERO;
        for (CreerCommandeRequest.LigneRequest ligne : lignes) {
            Produit produit = produitRepository.findById(ligne.produitId()).orElse(null);
            if (produit != null) {
                BigDecimal prixLigne = produit.getPrixEffectif().multiply(BigDecimal.valueOf(ligne.quantite()));
                total = total.add(prixLigne);
                message.append("• ").append(produit.getNom())
                       .append(" - Taille ").append(ligne.taille())
                      .append(" - ").append(ligne.couleur() != null ? ligne.couleur() : "Standard")
                       .append(" x").append(ligne.quantite())
                       .append(" = ").append(prixLigne).append(" ").append(devise).append("\n");
            }
        }

        message.append("\n💰 *Total:* ").append(total).append(" ").append(devise);
        message.append("\n\n👤 *Nom:* ").append(clientNom != null ? clientNom : "À confirmer");
        message.append("\n📞 *Téléphone:* ").append(clientTelephone != null ? clientTelephone : "À confirmer");

        return WhatsAppLinkDto.creer(numeroWhatsApp, message.toString());
    }

    private String genererNumeroCommande() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uuid = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "CMD-" + date + "-" + uuid;
    }
}

