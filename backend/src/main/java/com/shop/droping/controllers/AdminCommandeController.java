package com.shop.droping.controllers;

import com.shop.droping.enums.StatutCommande;
import com.shop.droping.facade.CommandeFacade;
import com.shop.droping.presentation.dto.CommandeDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/commandes")
public class AdminCommandeController {

    private final CommandeFacade commandeFacade;

    public AdminCommandeController(CommandeFacade commandeFacade) {
        this.commandeFacade = commandeFacade;
    }

    @GetMapping
    public ResponseEntity<List<CommandeDto>> listerToutes() {
        return ResponseEntity.ok(commandeFacade.listerToutesLesCommandes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommandeDto> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(commandeFacade.trouverParId(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<CommandeDto>> listerParStatut(@PathVariable String statut) {
        try {
            StatutCommande statutEnum = StatutCommande.valueOf(statut.toUpperCase());
            return ResponseEntity.ok(commandeFacade.listerParStatut(statutEnum));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<CommandeDto> changerStatut(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            StatutCommande statut = StatutCommande.valueOf(body.get("statut").toUpperCase());
            return ResponseEntity.ok(commandeFacade.mettreAJourStatut(id, statut));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/whatsapp/{id}")
    public ResponseEntity<?> getLienWhatsApp(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(commandeFacade.genererLienWhatsApp(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
