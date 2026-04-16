package com.shop.droping.repository;

import com.shop.droping.domain.Commande;
import com.shop.droping.enums.StatutCommande;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {

    Optional<Commande> findByNumero(String numero);

    List<Commande> findByStatut(StatutCommande statut);

    Page<Commande> findByStatut(StatutCommande statut, Pageable pageable);

    @Query("SELECT c FROM Commande c WHERE c.createAt BETWEEN :debut AND :fin ORDER BY c.createAt DESC")
    List<Commande> findByPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);

    @Query("SELECT c FROM Commande c LEFT JOIN FETCH c.lignes WHERE c.id = :id")
    Optional<Commande> findByIdWithLignes(@Param("id") Long id);

    @Query("SELECT c FROM Commande c LEFT JOIN FETCH c.lignes WHERE c.numero = :numero")
    Optional<Commande> findByNumeroWithLignes(@Param("numero") String numero);

    @Query("SELECT COUNT(c) FROM Commande c WHERE c.statut = :statut")
    Long countByStatut(@Param("statut") StatutCommande statut);

    List<Commande> findByClientTelephoneOrderByCreateAtDesc(String telephone);
}

