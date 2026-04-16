package com.shop.droping.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "produit_taille", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"produit_id", "taille"})
})
public class ProduitTaille extends AbstractEntity {

    public static final String TABLE_NAME = "produit_taille";
    public static final String TABLE_ID = TABLE_NAME + "_id";
    public static final String TABLE_SEQ = TABLE_ID + "_seq";

    @Id
    @SequenceGenerator(name = TABLE_SEQ, sequenceName = TABLE_SEQ, allocationSize = 50)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = TABLE_SEQ)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_id", nullable = false)
    @JsonIgnore
    private Produit produit;

    @Column(nullable = false, length = 10)
    private String taille; // XS, S, M, L, XL, XXL, etc.

    @Column(nullable = false)
    private Integer stock = 0;

    public ProduitTaille() {}

    public ProduitTaille(String taille, Integer stock) {
        this.taille = taille;
        this.stock = stock;
    }

    public boolean isEnStock() {
        return stock != null && stock > 0;
    }

    // Getters et Setters
    @Override
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Produit getProduit() { return produit; }
    public void setProduit(Produit produit) { this.produit = produit; }

    public String getTaille() { return taille; }
    public void setTaille(String taille) { this.taille = taille; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}

