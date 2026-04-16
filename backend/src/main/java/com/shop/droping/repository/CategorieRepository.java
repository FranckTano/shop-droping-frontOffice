package com.shop.droping.repository;

import com.shop.droping.domain.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategorieRepository extends JpaRepository<Categorie, Long> {

    List<Categorie> findByActifTrue();

    @Query("SELECT c FROM Categorie c WHERE c.actif = true ORDER BY c.nom")
    List<Categorie> findAllActiveOrderByNom();

    boolean existsByNomIgnoreCase(String nom);
}

