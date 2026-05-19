package com.shop.droping.controllers;

import com.shop.droping.enums.StatutCommande;
import com.shop.droping.presentation.dto.CommandeDto;
import com.shop.droping.presentation.dto.DashboardDto;
import com.shop.droping.repository.CommandeRepository;
import com.shop.droping.repository.ProduitRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    private final CommandeRepository commandeRepository;
    private final ProduitRepository produitRepository;

    public DashboardController(CommandeRepository commandeRepository, ProduitRepository produitRepository) {
        this.commandeRepository = commandeRepository;
        this.produitRepository = produitRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardDto> getStats() {
        long totalCommandes = commandeRepository.count();
        long enAttente = commandeRepository.countByStatut(StatutCommande.EN_ATTENTE);
        long validees = commandeRepository.countByStatut(StatutCommande.VALIDEE);
        long livrees = commandeRepository.countByStatut(StatutCommande.LIVREE);
        long annulees = commandeRepository.countByStatut(StatutCommande.ANNULEE);
        long standby = commandeRepository.countByStatut(StatutCommande.STANDBY);

        // Chiffre d'affaires = somme des montants de toutes les commandes non annulées
        BigDecimal ca = commandeRepository.findAll().stream()
                .filter(c -> c.getStatut() != StatutCommande.ANNULEE)
                .map(c -> c.getMontantTotal() != null ? c.getMontantTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // CA confirmé = commandes livrées seulement
        BigDecimal caLivrees = commandeRepository.findAll().stream()
                .filter(c -> c.getStatut() == StatutCommande.LIVREE)
                .map(c -> c.getMontantTotal() != null ? c.getMontantTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalProduits = produitRepository.count();
        long produitsActifs = produitRepository.findByActifTrue().size();
        long produitsArchives = totalProduits - produitsActifs;

        return ResponseEntity.ok(new DashboardDto(
                totalCommandes, enAttente, validees, livrees, annulees, standby,
                ca, caLivrees, totalProduits, produitsActifs, produitsArchives
        ));
    }

    @GetMapping("/commandes-recentes")
    public ResponseEntity<List<CommandeDto>> getCommandesRecentes() {
        List<CommandeDto> recentes = commandeRepository.findAll().stream()
                .sorted((a, b) -> b.getCreateAt() != null && a.getCreateAt() != null
                        ? b.getCreateAt().compareTo(a.getCreateAt()) : 0)
                .limit(10)
                .map(CommandeDto::fromEntity)
                .toList();
        return ResponseEntity.ok(recentes);
    }
}
