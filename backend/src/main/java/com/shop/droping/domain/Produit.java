package com.shop.droping.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "produit")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Produit extends AbstractEntity {

    public static final String TABLE_NAME = "produit";
    public static final String TABLE_ID = TABLE_NAME + "_id";
    public static final String TABLE_SEQ = TABLE_ID + "_seq";

    @Id
    @SequenceGenerator(name = TABLE_SEQ, sequenceName = TABLE_SEQ, allocationSize = 50)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = TABLE_SEQ)
    private Long id;

    @Column(nullable = false, length = 255)
    private String nom;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prix;

    @Column(name = "prix_promo", precision = 10, scale = 2)
    private BigDecimal prixPromo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categorie_id")
    @JsonIgnoreProperties({"produits", "hibernateLazyInitializer", "handler"})
    private Categorie categorie;

    @Column(name = "image_principale", length = 500)
    private String imagePrincipale;

    @Column(nullable = false)
    private Boolean actif = true;

    @Column(name = "en_promotion", nullable = false)
    private Boolean enPromotion = false;

    @Column(nullable = false)
    private Boolean nouveau = false;

    @Column(length = 100)
    private String equipe;

    @Column(length = 20)
    private String saison;

    @Column(length = 50)
    private String marque;

    @Column(name = "couleurs_disponibles", length = 255)
    private String couleursDisponibles;

    @OneToMany(mappedBy = "produit", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordre ASC")
    private List<ProduitImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "produit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProduitTaille> tailles = new ArrayList<>();

    public Produit() {}

    public Produit(String nom, String description, BigDecimal prix) {
        this.nom = nom;
        this.description = description;
        this.prix = prix;
    }

    // Méthodes utilitaires
    public BigDecimal getPrixEffectif() {
        if (Boolean.TRUE.equals(enPromotion)
                && prixPromo != null
                && prixPromo.compareTo(BigDecimal.ZERO) > 0) {
            return prixPromo;
        }
        return prix != null ? prix : BigDecimal.ZERO;
    }

    public Integer getStockTotal() {
        if (tailles == null) {
            return 0;
        }
        return tailles.stream()
            .mapToInt(t -> t.getStock() != null ? t.getStock() : 0)
            .sum();
    }

    public boolean isEnStock() {
        return getStockTotal() > 0;
    }

    public void addImage(ProduitImage image) {
        images.add(image);
        image.setProduit(this);
    }

    public void removeImage(ProduitImage image) {
        images.remove(image);
        image.setProduit(null);
    }

    public void addTaille(ProduitTaille taille) {
        tailles.add(taille);
        taille.setProduit(this);
    }

    public void removeTaille(ProduitTaille taille) {
        tailles.remove(taille);
        taille.setProduit(null);
    }

    // Getters et Setters
    @Override
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrix() { return prix; }
    public void setPrix(BigDecimal prix) { this.prix = prix; }

    public BigDecimal getPrixPromo() { return prixPromo; }
    public void setPrixPromo(BigDecimal prixPromo) { this.prixPromo = prixPromo; }

    public Categorie getCategorie() { return categorie; }
    public void setCategorie(Categorie categorie) { this.categorie = categorie; }

    public String getImagePrincipale() { return imagePrincipale; }
    public void setImagePrincipale(String imagePrincipale) { this.imagePrincipale = imagePrincipale; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }

    public Boolean getEnPromotion() { return enPromotion; }
    public void setEnPromotion(Boolean enPromotion) { this.enPromotion = enPromotion; }

    public Boolean getNouveau() { return nouveau; }
    public void setNouveau(Boolean nouveau) { this.nouveau = nouveau; }

    public String getEquipe() { return equipe; }
    public void setEquipe(String equipe) { this.equipe = equipe; }

    public String getSaison() { return saison; }
    public void setSaison(String saison) { this.saison = saison; }

    public String getMarque() { return marque; }
    public void setMarque(String marque) { this.marque = marque; }

    public String getCouleursDisponibles() { return couleursDisponibles; }
    public void setCouleursDisponibles(String couleursDisponibles) { this.couleursDisponibles = couleursDisponibles; }

    public List<ProduitImage> getImages() { return images; }
    public void setImages(List<ProduitImage> images) { this.images = images; }

    public List<ProduitTaille> getTailles() { return tailles; }
    public void setTailles(List<ProduitTaille> tailles) { this.tailles = tailles; }
}

