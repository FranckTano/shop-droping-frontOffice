package com.shop.droping.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ligne_commande")
public class LigneCommande extends AbstractEntity {

    public static final String TABLE_NAME = "ligne_commande";
    public static final String TABLE_ID = TABLE_NAME + "_id";
    public static final String TABLE_SEQ = TABLE_ID + "_seq";

    @Id
    @SequenceGenerator(name = TABLE_SEQ, sequenceName = TABLE_SEQ, allocationSize = 50)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = TABLE_SEQ)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    private Commande commande;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_id", nullable = false)
    private Produit produit;

    @Column(nullable = false, length = 10)
    private String taille;

    @Column(nullable = false, length = 30)
    private String couleur = "Standard";

    @Column(nullable = false)
    private Integer quantite = 1;

    @Column(name = "prix_unitaire", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixUnitaire;

    @Column(name = "prix_options_unitaire", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixOptionsUnitaire = BigDecimal.ZERO;

    @Column(name = "badges_officiels", nullable = false)
    private Boolean badgesOfficiels = false;

    @Column(name = "flocage", nullable = false)
    private Boolean flocage = false;

    @Column(name = "flocage_nom", length = 100)
    private String flocageNom;

    @Column(name = "flocage_numero", length = 20)
    private String flocageNumero;

    @Column(name = "prix_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixTotal;

    public LigneCommande() {}

    public LigneCommande(Produit produit, String taille, Integer quantite, BigDecimal prixUnitaire) {
        this.produit = produit;
        this.taille = taille;
        this.quantite = quantite;
        this.prixUnitaire = prixUnitaire;
        this.prixTotal = prixUnitaire.add(prixOptionsUnitaire).multiply(BigDecimal.valueOf(quantite));
    }

    public void calculerPrixTotal() {
        BigDecimal base = prixUnitaire != null ? prixUnitaire : BigDecimal.ZERO;
        BigDecimal options = prixOptionsUnitaire != null ? prixOptionsUnitaire : BigDecimal.ZERO;
        BigDecimal qty = BigDecimal.valueOf(quantite != null ? quantite : 0);
        this.prixTotal = base.add(options).multiply(qty);
    }

    // Getters et Setters
    @Override
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Commande getCommande() { return commande; }
    public void setCommande(Commande commande) { this.commande = commande; }

    public Produit getProduit() { return produit; }
    public void setProduit(Produit produit) { this.produit = produit; }

    public String getTaille() { return taille; }
    public void setTaille(String taille) { this.taille = taille; }

    public String getCouleur() { return couleur; }
    public void setCouleur(String couleur) { this.couleur = couleur; }

    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) { this.quantite = quantite; }

    public BigDecimal getPrixUnitaire() { return prixUnitaire; }
    public void setPrixUnitaire(BigDecimal prixUnitaire) { this.prixUnitaire = prixUnitaire; }

    public BigDecimal getPrixOptionsUnitaire() { return prixOptionsUnitaire; }
    public void setPrixOptionsUnitaire(BigDecimal prixOptionsUnitaire) { this.prixOptionsUnitaire = prixOptionsUnitaire; }

    public Boolean getBadgesOfficiels() { return badgesOfficiels; }
    public void setBadgesOfficiels(Boolean badgesOfficiels) { this.badgesOfficiels = badgesOfficiels; }

    public Boolean getFlocage() { return flocage; }
    public void setFlocage(Boolean flocage) { this.flocage = flocage; }

    public String getFlocageNom() { return flocageNom; }
    public void setFlocageNom(String flocageNom) { this.flocageNom = flocageNom; }

    public String getFlocageNumero() { return flocageNumero; }
    public void setFlocageNumero(String flocageNumero) { this.flocageNumero = flocageNumero; }

    public BigDecimal getPrixTotal() { return prixTotal; }
    public void setPrixTotal(BigDecimal prixTotal) { this.prixTotal = prixTotal; }
}

