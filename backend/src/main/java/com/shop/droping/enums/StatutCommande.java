package com.shop.droping.enums;

public enum StatutCommande {
    EN_ATTENTE("En attente"),
    CONFIRMEE("Confirmée"),
    EN_COURS("En cours"),
    EXPEDIEE("Expédiée"),
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
