package com.shop.droping.presentation.dto;

import com.shop.droping.domain.Produit;
import com.shop.droping.domain.ProduitTaille;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

public record ProduitDto(
    Long id,
    String nom,
    String description,
    BigDecimal prix,
    BigDecimal prixPromo,
    BigDecimal prixEffectif,
    String imagePrincipale,
    Boolean actif,
    Boolean enPromotion,
    Boolean nouveau,
    String equipe,
    String saison,
    String marque,
    List<String> couleursDisponibles,
    Long categorieId,
    String categorieNom,
    List<String> images,
    List<TailleDto> tailles,
    Integer stockTotal,
    Boolean enStock
) {
    public record TailleDto(Long id, String taille, Integer stock, Boolean enStock) {
        public static TailleDto fromEntity(ProduitTaille pt) {
            return new TailleDto(pt.getId(), pt.getTaille(), pt.getStock(), pt.isEnStock());
        }
    }

    public static ProduitDto fromEntity(Produit produit) {
        return new ProduitDto(
            produit.getId(),
            produit.getNom(),
            produit.getDescription(),
            produit.getPrix(),
            produit.getPrixPromo(),
            produit.getPrixEffectif(),
            produit.getImagePrincipale(),
            produit.getActif(),
            produit.getEnPromotion(),
            produit.getNouveau(),
            produit.getEquipe(),
            produit.getSaison(),
            produit.getMarque(),
            splitCsv(produit.getCouleursDisponibles()),
            produit.getCategorie() != null ? produit.getCategorie().getId() : null,
            produit.getCategorie() != null ? produit.getCategorie().getNom() : null,
            produit.getImages() != null ?
                produit.getImages().stream().map(img -> img.getUrl()).toList() : List.of(),
            produit.getTailles() != null ?
                produit.getTailles().stream().map(TailleDto::fromEntity).toList() : List.of(),
            produit.getStockTotal(),
            produit.isEnStock()
        );
    }

    public static ProduitDto fromEntitySimple(Produit produit) {
        return new ProduitDto(
            produit.getId(),
            produit.getNom(),
            produit.getDescription(),
            produit.getPrix(),
            produit.getPrixPromo(),
            produit.getPrixEffectif(),
            produit.getImagePrincipale(),
            produit.getActif(),
            produit.getEnPromotion(),
            produit.getNouveau(),
            produit.getEquipe(),
            produit.getSaison(),
            produit.getMarque(),
            splitCsv(produit.getCouleursDisponibles()),
            produit.getCategorie() != null ? produit.getCategorie().getId() : null,
            produit.getCategorie() != null ? produit.getCategorie().getNom() : null,
            produit.getImages() != null ?
                produit.getImages().stream().map(img -> img.getUrl()).toList() : List.of(),
            produit.getTailles() != null ?
                produit.getTailles().stream().map(TailleDto::fromEntity).toList() : List.of(),
            produit.getStockTotal(),
            produit.isEnStock()
        );
    }

    private static List<String> splitCsv(String csv) {
        if (csv == null || csv.isBlank()) {
            return List.of();
        }

        return Arrays.stream(csv.split(","))
            .map(String::trim)
            .filter(value -> !value.isBlank())
            .toList();
    }
}

