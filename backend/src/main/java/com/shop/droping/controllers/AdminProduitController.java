package com.shop.droping.controllers;

import com.shop.droping.facade.ProduitFacade;
import com.shop.droping.presentation.dto.ProduitDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/produits")
public class AdminProduitController {

    private final ProduitFacade produitFacade;

    public AdminProduitController(ProduitFacade produitFacade) {
        this.produitFacade = produitFacade;
    }

    /** Liste tous les produits actifs */
    @GetMapping
    public ResponseEntity<List<ProduitDto>> listerTous() {
        return ResponseEntity.ok(produitFacade.listerTousLesProduits());
    }

    /** Liste tous les produits archivés (actif = false) */
    @GetMapping("/archives")
    public ResponseEntity<List<ProduitDto>> listerArchives() {
        return ResponseEntity.ok(produitFacade.listerProduitsArchives());
    }

    /** Détail d'un produit */
    @GetMapping("/{id}")
    public ResponseEntity<ProduitDto> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(produitFacade.trouverParId(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    /** Créer un nouveau produit */
    @PostMapping
    public ResponseEntity<ProduitDto> creer(@RequestBody ProduitCreateRequest req) {
        ProduitDto created = produitFacade.creer(
                req.nom(), req.description(), req.prix(), req.prixPromo(),
                req.categorieId(), req.imagePrincipale(), req.equipe(),
                req.saison(), req.marque(), req.enPromotion(), req.nouveau(),
                req.images(), req.tailles()
        );
        return ResponseEntity.ok(created);
    }

    /** Mettre à jour un produit */
    @PutMapping("/{id}")
    public ResponseEntity<ProduitDto> mettreAJour(@PathVariable Long id, @RequestBody ProduitUpdateRequest req) {
        ProduitDto updated = produitFacade.mettreAJour(
                id, req.nom(), req.description(), req.prix(), req.prixPromo(),
                req.categorieId(), req.imagePrincipale(), req.equipe(),
                req.saison(), req.marque(), req.enPromotion(), req.nouveau(), req.actif()
        );
        return ResponseEntity.ok(updated);
    }

    /** Archiver un produit (soft delete) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> archiver(@PathVariable Long id) {
        produitFacade.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    /** Restaurer un produit archivé */
    @PatchMapping("/{id}/restaurer")
    public ResponseEntity<ProduitDto> restaurer(@PathVariable Long id) {
        ProduitDto restored = produitFacade.restaurer(id);
        return ResponseEntity.ok(restored);
    }

    /** Changer statut actif/archivé */
    @PatchMapping("/{id}/statut")
    public ResponseEntity<ProduitDto> changerStatut(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        boolean actif = Boolean.TRUE.equals(body.get("actif"));
        ProduitDto updated = produitFacade.changerStatutActif(id, actif);
        return ResponseEntity.ok(updated);
    }

    // Records pour les requêtes
    public record ProduitCreateRequest(
            String nom,
            String description,
            BigDecimal prix,
            BigDecimal prixPromo,
            Long categorieId,
            String imagePrincipale,
            String equipe,
            String saison,
            String marque,
            Boolean enPromotion,
            Boolean nouveau,
            List<String> images,
            Map<String, Integer> tailles
    ) {}

    public record ProduitUpdateRequest(
            String nom,
            String description,
            BigDecimal prix,
            BigDecimal prixPromo,
            Long categorieId,
            String imagePrincipale,
            String equipe,
            String saison,
            String marque,
            Boolean enPromotion,
            Boolean nouveau,
            Boolean actif
    ) {}
}
