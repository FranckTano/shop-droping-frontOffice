package com.shop.droping.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Sert index.html pour toutes les routes Angular non-API.
 * Nécessaire avec PathLocationStrategy pour que les rechargements de page fonctionnent.
 */
@Controller
public class SpaController {

    @RequestMapping(value = {
            "/boutique",
            "/boutique/**",
            "/",
            "/connexion",
            "/connexion/**"
    })
    public String forward(HttpServletRequest request) {
        return "forward:/index.html";
    }
}
