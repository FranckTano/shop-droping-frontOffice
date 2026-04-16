package com.shop.droping.presentation.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO pour créer une nouvelle commande depuis le panier
 */
public record CreerCommandeRequest(
    String clientNom,
    String clientTelephone,
    String clientEmail,
    String clientAdresse,
    String notes,
    List<LigneRequest> lignes
) {
    public record LigneRequest(
        Long produitId,
        String taille,
        String couleur,
        Integer quantite,
        Boolean badgesOfficiels,
        Boolean flocage,
        String flocageNom,
        String flocageNumero,
        BigDecimal prixOptionsUnitaire
    ) {}
}

