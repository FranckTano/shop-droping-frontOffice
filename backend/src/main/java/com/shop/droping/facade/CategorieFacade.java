package com.shop.droping.facade;

import com.shop.droping.domain.Categorie;
import com.shop.droping.presentation.dto.CategorieDto;
import com.shop.droping.repository.CategorieRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CategorieFacade {

    private final CategorieRepository categorieRepository;

    public CategorieFacade(CategorieRepository categorieRepository) {
        this.categorieRepository = categorieRepository;
    }

    public List<CategorieDto> listerToutesLesCategories() {
        return categorieRepository.findAllActiveOrderByNom()
            .stream()
            .map(CategorieDto::fromEntity)
            .toList();
    }

    public CategorieDto trouverParId(Long id) {
        return categorieRepository.findById(id)
            .map(CategorieDto::fromEntity)
            .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec l'ID: " + id));
    }

    @Transactional
    public CategorieDto creer(String nom, String description, String imageUrl) {
        if (categorieRepository.existsByNomIgnoreCase(nom)) {
            throw new RuntimeException("Une catégorie avec ce nom existe déjà");
        }

        Categorie categorie = new Categorie(nom, description);
        categorie.setImageUrl(imageUrl);
        categorie.setActif(true);

        return CategorieDto.fromEntity(categorieRepository.save(categorie));
    }

    @Transactional
    public CategorieDto mettreAJour(Long id, String nom, String description, String imageUrl, Boolean actif) {
        Categorie categorie = categorieRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec l'ID: " + id));

        categorie.setNom(nom);
        categorie.setDescription(description);
        categorie.setImageUrl(imageUrl);
        categorie.setActif(actif);

        return CategorieDto.fromEntity(categorieRepository.save(categorie));
    }

    @Transactional
    public void supprimer(Long id) {
        Categorie categorie = categorieRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec l'ID: " + id));

        // Soft delete - désactiver plutôt que supprimer
        categorie.setActif(false);
        categorieRepository.save(categorie);
    }
}

