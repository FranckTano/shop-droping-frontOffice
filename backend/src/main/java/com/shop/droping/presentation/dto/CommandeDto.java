package com.shop.droping.presentation.dto;

import com.shop.droping.domain.Commande;
import com.shop.droping.domain.LigneCommande;
import com.shop.droping.enums.StatutCommande;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CommandeDto(
    Long id,
    String numero,
    String clientNom,
    String clientTelephone,
    String clientEmail,
    String clientAdresse,
    BigDecimal montantTotal,
    StatutCommande statut,
    String notes,
    Boolean whatsappMessageSent,
    LocalDateTime dateCreation,
    List<LigneCommandeDto> lignes
) {
    public record LigneCommandeDto(
        Long id,
        Long produitId,
        String produitNom,
        String produitImage,
        String taille,
        String couleur,
        Integer quantite,
        Boolean badgesOfficiels,
        Boolean flocage,
        String flocageNom,
        String flocageNumero,
        BigDecimal prixUnitaire,
        BigDecimal prixOptionsUnitaire,
        BigDecimal prixTotal
    ) {
        public static LigneCommandeDto fromEntity(LigneCommande ligne) {
            return new LigneCommandeDto(
                ligne.getId(),
                ligne.getProduit() != null ? ligne.getProduit().getId() : null,
                ligne.getProduit() != null ? ligne.getProduit().getNom() : "Produit supprimé",
                ligne.getProduit() != null ? ligne.getProduit().getImagePrincipale() : null,
                ligne.getTaille(),
                ligne.getCouleur(),
                ligne.getQuantite(),
                ligne.getBadgesOfficiels(),
                ligne.getFlocage(),
                ligne.getFlocageNom(),
                ligne.getFlocageNumero(),
                ligne.getPrixUnitaire(),
                ligne.getPrixOptionsUnitaire(),
                ligne.getPrixTotal()
            );
        }
    }

    public static CommandeDto fromEntity(Commande commande) {
        return new CommandeDto(
            commande.getId(),
            commande.getNumero(),
            commande.getClientNom(),
            commande.getClientTelephone(),
            commande.getClientEmail(),
            commande.getClientAdresse(),
            commande.getMontantTotal(),
            commande.getStatut(),
            commande.getNotes(),
            commande.getWhatsappMessageSent(),
            commande.getCreateAt(),
            commande.getLignes() != null ?
                commande.getLignes().stream().map(LigneCommandeDto::fromEntity).toList() : List.of()
        );
    }
}

