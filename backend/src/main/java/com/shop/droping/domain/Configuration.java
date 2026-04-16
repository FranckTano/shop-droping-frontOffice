package com.shop.droping.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "configuration")
public class Configuration extends AbstractEntity {

    public static final String TABLE_NAME = "configuration";
    public static final String TABLE_ID = TABLE_NAME + "_id";
    public static final String TABLE_SEQ = TABLE_ID + "_seq";

    // Clés de configuration prédéfinies
    public static final String CLE_WHATSAPP_NUMERO = "whatsapp_numero";
    public static final String CLE_NOM_BOUTIQUE = "nom_boutique";
    public static final String CLE_DEVISE = "devise";
    public static final String CLE_EMAIL_CONTACT = "email_contact";
    public static final String CLE_MESSAGE_WHATSAPP_TEMPLATE = "message_whatsapp_template";

    @Id
    @SequenceGenerator(name = TABLE_SEQ, sequenceName = TABLE_SEQ, allocationSize = 50)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = TABLE_SEQ)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String cle;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String valeur;

    @Column(length = 255)
    private String description;

    public Configuration() {}

    public Configuration(String cle, String valeur, String description) {
        this.cle = cle;
        this.valeur = valeur;
        this.description = description;
    }

    // Getters et Setters
    @Override
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCle() { return cle; }
    public void setCle(String cle) { this.cle = cle; }

    public String getValeur() { return valeur; }
    public void setValeur(String valeur) { this.valeur = valeur; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

