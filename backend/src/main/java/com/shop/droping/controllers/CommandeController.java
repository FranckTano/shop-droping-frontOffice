package com.shop.droping.controllers;

import com.shop.droping.enums.StatutCommande;
import com.shop.droping.facade.CommandeFacade;
import com.shop.droping.presentation.dto.CommandeDto;
import com.shop.droping.presentation.dto.CreerCommandeRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {

    private final CommandeFacade commandeFacade;

    public CommandeController(CommandeFacade commandeFacade) {
        this.commandeFacade = commandeFacade;
    }

    @GetMapping
    public List<CommandeDto> getAllCommandes() {
        return commandeFacade.listerToutesLesCommandes();
    }



    @PostMapping
    public CommandeDto createCommande(@RequestBody CreerCommandeRequest commande) {
        return commandeFacade.creerCommande(commande);
    }

    @PutMapping("/{id}/statut")
    public CommandeDto updateStatutCommande(@PathVariable Long id, @RequestBody String statut) {
        return commandeFacade.mettreAJourStatut(id, StatutCommande.valueOf(statut));
    }
}
