package com.shop.droping.controllers;

import com.shop.droping.facade.CommandeFacade;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class ConfigPublicController {

    private final CommandeFacade commandeFacade;

    public ConfigPublicController(CommandeFacade commandeFacade) {
        this.commandeFacade = commandeFacade;
    }

    @GetMapping("/numero-whatsapp")
    public Map<String, String> getNumeroWhatsApp() {
        return Map.of("numero", commandeFacade.getNumeroWhatsApp());
    }
}
