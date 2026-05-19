package com.shop.droping.enums;

public enum StatutCommande {
    EN_ATTENTE("En attente"),
    VALIDEE("Validée"),
    LIVREE("Livrée"),
    ANNULEE("Annulée"),
    STANDBY("Stand-by");

    private final String libelle;

    StatutCommande(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelle() {
        return libelle;
    }
}
