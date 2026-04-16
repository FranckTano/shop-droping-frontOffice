package com.shop.droping.repository;

import com.shop.droping.domain.Produit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {

    List<Produit> findByActifTrue();

    Page<Produit> findByActifTrue(Pageable pageable);

    List<Produit> findByActifTrueAndCategorieId(Long categorieId);

    Page<Produit> findByActifTrueAndCategorieId(Long categorieId, Pageable pageable);

    List<Produit> findByActifTrueAndEnPromotionTrue();

    List<Produit> findByActifTrueAndNouveauTrue();

    @Query("SELECT p FROM Produit p WHERE p.actif = true AND " +
           "(LOWER(p.nom) LIKE LOWER(CONCAT('%', :recherche, '%')) OR " +
           "LOWER(p.equipe) LIKE LOWER(CONCAT('%', :recherche, '%')) OR " +
           "LOWER(p.marque) LIKE LOWER(CONCAT('%', :recherche, '%')))")
    List<Produit> rechercherProduits(@Param("recherche") String recherche);

    @Query("SELECT DISTINCT p FROM Produit p LEFT JOIN FETCH p.tailles LEFT JOIN FETCH p.images WHERE p.id = :id")
    Optional<Produit> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT DISTINCT p.equipe FROM Produit p WHERE p.actif = true AND p.equipe IS NOT NULL ORDER BY p.equipe")
    List<String> findAllEquipes();

    @Query("SELECT DISTINCT p.marque FROM Produit p WHERE p.actif = true AND p.marque IS NOT NULL ORDER BY p.marque")
    List<String> findAllMarques();
}

