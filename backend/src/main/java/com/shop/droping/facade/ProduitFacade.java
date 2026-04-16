package com.shop.droping.facade;

import com.shop.droping.domain.Categorie;
import com.shop.droping.domain.Produit;
import com.shop.droping.domain.ProduitImage;
import com.shop.droping.domain.ProduitTaille;
import com.shop.droping.presentation.dto.ProduitDto;
import com.shop.droping.repository.CategorieRepository;
import com.shop.droping.repository.ProduitRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class ProduitFacade {

    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;

    public ProduitFacade(ProduitRepository produitRepository, CategorieRepository categorieRepository) {
        this.produitRepository = produitRepository;
        this.categorieRepository = categorieRepository;
    }

    public List<ProduitDto> listerTousLesProduits() {
        return produitRepository.findByActifTrue()
            .stream()
            .map(ProduitDto::fromEntity)
            .toList();
    }

    public Page<ProduitDto> listerProduitsPage(Pageable pageable) {
        return produitRepository.findByActifTrue(pageable)
            .map(ProduitDto::fromEntity);
    }

    public List<ProduitDto> listerParCategorie(Long categorieId) {
        return produitRepository.findByActifTrueAndCategorieId(categorieId)
            .stream()
            .map(ProduitDto::fromEntity)
            .toList();
    }

    public List<ProduitDto> listerPromotions() {
        return produitRepository.findByActifTrueAndEnPromotionTrue()
            .stream()
            .map(ProduitDto::fromEntity)
            .toList();
    }

    public List<ProduitDto> listerNouveautes() {
        return produitRepository.findByActifTrueAndNouveauTrue()
            .stream()
            .map(ProduitDto::fromEntity)
            .toList();
    }

    public List<ProduitDto> rechercher(String terme) {
        return produitRepository.rechercherProduits(terme)
            .stream()
            .map(ProduitDto::fromEntity)
            .toList();
    }

    public ProduitDto trouverParId(Long id) {
        return produitRepository.findByIdWithDetails(id)
            .map(ProduitDto::fromEntity)
            .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID: " + id));
    }

    public List<String> listerEquipes() {
        return produitRepository.findAllEquipes();
    }

    public List<String> listerMarques() {
        return produitRepository.findAllMarques();
    }

    @Transactional
    public ProduitDto creer(String nom, String description, BigDecimal prix, BigDecimal prixPromo,
                           Long categorieId, String imagePrincipale, String equipe, String saison,
                           String marque, Boolean enPromotion, Boolean nouveau,
                           List<String> images, Map<String, Integer> tailles) {

        Produit produit = new Produit(nom, description, prix);
        produit.setPrixPromo(prixPromo);
        produit.setImagePrincipale(imagePrincipale);
        produit.setEquipe(equipe);
        produit.setSaison(saison);
        produit.setMarque(marque);
        produit.setEnPromotion(enPromotion != null && enPromotion);
        produit.setNouveau(nouveau != null && nouveau);
        produit.setActif(true);

        if (categorieId != null) {
            Categorie categorie = categorieRepository.findById(categorieId)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
            produit.setCategorie(categorie);
        }

        // Ajouter les images
        if (images != null) {
            int ordre = 0;
            for (String url : images) {
                produit.addImage(new ProduitImage(url, ordre++));
            }
        }

        // Ajouter les tailles avec stock
        if (tailles != null) {
            for (Map.Entry<String, Integer> entry : tailles.entrySet()) {
                produit.addTaille(new ProduitTaille(entry.getKey(), entry.getValue()));
            }
        }

        return ProduitDto.fromEntity(produitRepository.save(produit));
    }

    @Transactional
    public ProduitDto mettreAJour(Long id, String nom, String description, BigDecimal prix,
                                  BigDecimal prixPromo, Long categorieId, String imagePrincipale,
                                  String equipe, String saison, String marque,
                                  Boolean enPromotion, Boolean nouveau, Boolean actif) {

        Produit produit = produitRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID: " + id));

        produit.setNom(nom);
        produit.setDescription(description);
        produit.setPrix(prix);
        produit.setPrixPromo(prixPromo);
        produit.setImagePrincipale(imagePrincipale);
        produit.setEquipe(equipe);
        produit.setSaison(saison);
        produit.setMarque(marque);
        produit.setEnPromotion(enPromotion != null && enPromotion);
        produit.setNouveau(nouveau != null && nouveau);
        produit.setActif(actif != null && actif);

        if (categorieId != null) {
            Categorie categorie = categorieRepository.findById(categorieId)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
            produit.setCategorie(categorie);
        }

        return ProduitDto.fromEntity(produitRepository.save(produit));
    }

    @Transactional
    public void supprimer(Long id) {
        Produit produit = produitRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID: " + id));

        // Soft delete
        produit.setActif(false);
        produitRepository.save(produit);
    }
}

