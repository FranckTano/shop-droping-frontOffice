package com.shop.droping.enums;

public enum StatutCommande {
    EN_ATTENTE("En attente"),
    CONFIRMEE("Confirmée"),
    EN_LIVRAISON("En livraison"),
    LIVREE("Livrée"),
    ANNULEE("Annulée");

    private final String libelle;

    StatutCommande(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelle() {
        return libelle;
    }
}

