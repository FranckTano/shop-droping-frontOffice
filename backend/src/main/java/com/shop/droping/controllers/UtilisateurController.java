package com.shop.droping.controllers;

import com.shop.droping.enums.Role;
import com.shop.droping.enums.StatutUtilisateur;
import com.shop.droping.facade.UtilisateurFacade;
import com.shop.droping.presentation.dto.UtilisateurDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final UtilisateurFacade utilisateurFacade;

    public UtilisateurController(UtilisateurFacade utilisateurFacade) {
        this.utilisateurFacade = utilisateurFacade;
    }

    @GetMapping
    public ResponseEntity<List<UtilisateurDto>> lister() {
        return ResponseEntity.ok(utilisateurFacade.lister());
    }

    @PostMapping
    public ResponseEntity<Void> creer(@RequestBody UtilisateurDto dto) {
        utilisateurFacade.enregistrer(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> mettreAJour(@PathVariable Long id, @RequestBody UtilisateurDto dto) {
        utilisateurFacade.mettreAJour(id, dto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<Void> changerStatut(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            StatutUtilisateur statut = StatutUtilisateur.valueOf(body.get("statut").toUpperCase());
            utilisateurFacade.changerStatut(id, statut);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        utilisateurFacade.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
