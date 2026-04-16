package com.shop.droping.domain;

import com.shop.droping.enums.StatutCommande;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "commande")
public class Commande extends AbstractEntity {

    public static final String TABLE_NAME = "commande";
    public static final String TABLE_ID = TABLE_NAME + "_id";
    public static final String TABLE_SEQ = TABLE_ID + "_seq";

    @Id
    @SequenceGenerator(name = TABLE_SEQ, sequenceName = TABLE_SEQ, allocationSize = 50)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = TABLE_SEQ)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String numero;

    @Column(name = "client_nom", nullable = false, length = 100)
    private String clientNom;

    @Column(name = "client_telephone", nullable = false, length = 50)
    private String clientTelephone;

    @Column(name = "client_email", length = 100)
    private String clientEmail;

    @Column(name = "client_adresse", columnDefinition = "TEXT")
    private String clientAdresse;

    @Column(name = "montant_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal montantTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private StatutCommande statut = StatutCommande.EN_ATTENTE;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "whatsapp_message_sent")
    private Boolean whatsappMessageSent = false;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LigneCommande> lignes = new ArrayList<>();

    public Commande() {}

    public void addLigne(LigneCommande ligne) {
        lignes.add(ligne);
        ligne.setCommande(this);
    }

    public void removeLigne(LigneCommande ligne) {
        lignes.remove(ligne);
        ligne.setCommande(null);
    }

    public void calculerMontantTotal() {
        this.montantTotal = lignes.stream()
            .map(LigneCommande::getPrixTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Getters et Setters
    @Override
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getClientNom() { return clientNom; }
    public void setClientNom(String clientNom) { this.clientNom = clientNom; }

    public String getClientTelephone() { return clientTelephone; }
    public void setClientTelephone(String clientTelephone) { this.clientTelephone = clientTelephone; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }

    public String getClientAdresse() { return clientAdresse; }
    public void setClientAdresse(String clientAdresse) { this.clientAdresse = clientAdresse; }

    public BigDecimal getMontantTotal() { return montantTotal; }
    public void setMontantTotal(BigDecimal montantTotal) { this.montantTotal = montantTotal; }

    public StatutCommande getStatut() { return statut; }
    public void setStatut(StatutCommande statut) { this.statut = statut; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Boolean getWhatsappMessageSent() { return whatsappMessageSent; }
    public void setWhatsappMessageSent(Boolean whatsappMessageSent) { this.whatsappMessageSent = whatsappMessageSent; }

    public List<LigneCommande> getLignes() { return lignes; }
    public void setLignes(List<LigneCommande> lignes) { this.lignes = lignes; }
}

