package com.shop.droping.controllers;

import com.shop.droping.domain.Produit;
import com.shop.droping.facade.ProduitFacade;
import com.shop.droping.presentation.dto.ProduitDto;
import com.shop.droping.services.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
public class ProduitController {

    @Autowired
    private ProduitFacade produitFacade;

    @Autowired
    private ProduitService produitService;

    @GetMapping
    public List<ProduitDto> getAllProduits() {
        return produitFacade.listerTousLesProduits();
    }

    @GetMapping("/categorie/{categorieId}")
    public List<ProduitDto> getProduitsParCategorie(@PathVariable Long categorieId) {
        return produitFacade.listerParCategorie(categorieId);
    }

    @GetMapping("/promotions")
    public List<ProduitDto> getProduitsEnPromotion() {
        return produitFacade.listerPromotions();
    }

    @GetMapping("/nouveautes")
    public List<ProduitDto> getProduitsNouveautes() {
        return produitFacade.listerNouveautes();
    }

    @GetMapping("/recherche")
    public List<ProduitDto> searchProduits(@RequestParam("terme") String terme) {
        return produitFacade.rechercher(terme);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduitDto> getProduitById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(produitFacade.trouverParId(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Produit createProduit(@RequestBody Produit produit) {
        return produitService.saveProduit(produit);
    }
}
