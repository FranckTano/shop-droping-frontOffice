package com.shop.droping.presentation.dto;

import com.shop.droping.domain.Categorie;

public record CategorieDto(
    Long id,
    String nom,
    String description,
    String imageUrl,
    Boolean actif,
    Integer nombreProduits
) {
    public static CategorieDto fromEntity(Categorie categorie) {
        return new CategorieDto(
            categorie.getId(),
            categorie.getNom(),
            categorie.getDescription(),
            categorie.getImageUrl(),
            categorie.getActif(),
            categorie.getProduits() != null ? categorie.getProduits().size() : 0
        );
    }

    public static CategorieDto fromEntitySimple(Categorie categorie) {
        return new CategorieDto(
            categorie.getId(),
            categorie.getNom(),
            categorie.getDescription(),
            categorie.getImageUrl(),
            categorie.getActif(),
            null
        );
    }
}

