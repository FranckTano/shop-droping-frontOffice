package com.shop.droping.services;

import com.shop.droping.domain.Commande;
import com.shop.droping.repository.CommandeRepository;
import com.shop.droping.enums.StatutCommande;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommandeService {

    @Autowired
    private CommandeRepository commandeRepository;

    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }

    public Commande saveCommande(Commande commande) {
        // Logique de calcul de prix
        return commandeRepository.save(commande);
    }

    public Commande updateStatutCommande(Long id, String statut) {
        Commande commande = commandeRepository.findById(id).orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        commande.setStatut(StatutCommande.valueOf(statut));
        return commandeRepository.save(commande);
    }
}
