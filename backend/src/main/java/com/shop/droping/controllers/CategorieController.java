package com.shop.droping.controllers;

import com.shop.droping.facade.CategorieFacade;
import com.shop.droping.presentation.dto.CategorieDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategorieController {

    private final CategorieFacade categorieFacade;

    public CategorieController(CategorieFacade categorieFacade) {
        this.categorieFacade = categorieFacade;
    }

    @GetMapping
    public List<CategorieDto> getAllCategories() {
        return categorieFacade.listerToutesLesCategories();
    }

    @GetMapping("/{id}")
    public CategorieDto getCategoryById(@PathVariable Long id) {
        return categorieFacade.trouverParId(id);
    }
}