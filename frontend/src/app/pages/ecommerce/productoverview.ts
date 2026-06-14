import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { ProduitService, Produit } from '@services/produit.service';
import { PanierService, OptionsMaillot } from '@services/panier.service';
import { AnalyticsService } from '@services/analytics.service';
import { MetaService } from '@services/meta.service';

@Component({
    selector: 'app-product-overview',
    standalone: true,
    imports: [CommonModule, FormsModule, ToastModule, SkeletonModule, RouterModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>

        <div class="po-shell">

            <!-- Fil d'Ariane -->
            <div class="po-breadcrumb">
                <div class="po-container">
                    <a routerLink="/boutique" class="po-crumb-link">Boutique</a>
                    <span class="po-crumb-sep">›</span>
                    <span class="po-crumb-current">{{ produit?.nom ?? 'Chargement...' }}</span>
                </div>
            </div>

            <!-- SKELETON -->
            <div *ngIf="chargement" class="po-container po-skeleton-grid">
                <p-skeleton height="560px" borderRadius="1rem"></p-skeleton>
                <div style="padding:0.5rem">
                    <p-skeleton width="35%" height="0.9rem" styleClass="mb-3"></p-skeleton>
                    <p-skeleton width="70%" height="2.2rem" styleClass="mb-3"></p-skeleton>
                    <p-skeleton width="25%" height="1.8rem" styleClass="mb-4"></p-skeleton>
                    <p-skeleton height="4rem" styleClass="mb-3"></p-skeleton>
                    <p-skeleton height="4rem" styleClass="mb-3"></p-skeleton>
                    <p-skeleton height="6rem" styleClass="mb-3"></p-skeleton>
                    <p-skeleton height="3.5rem"></p-skeleton>
                </div>
            </div>

            <!-- CONTENU -->
            <div *ngIf="!chargement && produit" class="po-container po-grid">

                <!-- ══ COLONNE IMAGE ══ -->
                <div class="po-media">

                    <!-- Cadre image avec overlays de prévisualisation -->
                    <div class="po-media__frame">

                        <!-- Badge catégorie -->
                        <span class="po-media__cat-badge">{{ labelCategorie(produit.categorie) }}</span>

                        <!-- Badge stock -->
                        <span class="po-media__stock" [class.po-media__stock--low]="produit.stockTotal > 0 && produit.stockTotal < 8">
                            <svg width="7" height="7" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4"/></svg>
                            {{ stockLabel() }}
                        </span>

                        <!-- Image maillot -->
                        <img
                            [src]="produitService.resolveImageUrl(produit.imageUrl)"
                            [alt]="produit.nom"
                            class="po-media__img"
                            loading="lazy"
                            (error)="onImageError($event)" />

                        <!-- ═══ OVERLAY BADGES OFFICIELS ═══ -->
                        <div *ngIf="badgesOfficiels" class="po-overlay-badges">
                            <div class="po-overlay-badges__patch">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            </div>
                            <div class="po-overlay-badges__patch">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                            </div>
                            <span class="po-overlay-badges__label">Badges officiels</span>
                        </div>

                        <!-- ═══ OVERLAY FLOCAGE ═══ -->
                        <div class="po-overlay-flocage" *ngIf="flocage && (flocageNom.trim() || flocageNumero.trim())">
                            <span class="po-overlay-flocage__nom" *ngIf="flocageNom.trim()">
                                {{ flocageNom.toUpperCase() }}
                            </span>
                            <span class="po-overlay-flocage__numero" *ngIf="flocageNumero.trim()">
                                {{ flocageNumero }}
                            </span>
                        </div>

                        <!-- Indicateur "Aperçu dos" si flocage actif -->
                        <div *ngIf="flocage" class="po-media__dos-hint">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Aperçu dos du maillot
                        </div>
                    </div>

                    <!-- Indicateurs options actives sous l'image -->
                    <div class="po-media__options-actives" *ngIf="badgesOfficiels || flocage">
                        <span *ngIf="badgesOfficiels" class="po-option-chip po-option-chip--badges">
                            ⭐ Badges officiels
                        </span>
                        <span *ngIf="flocage && (flocageNom.trim() || flocageNumero.trim())" class="po-option-chip po-option-chip--flocage">
                            ✏️ {{ flocageNom.trim() || '' }}{{ flocageNom.trim() && flocageNumero.trim() ? ' #' : (flocageNumero.trim() ? '#' : '') }}{{ flocageNumero.trim() || '' }}
                        </span>
                    </div>

                    <!-- Caractéristiques produit -->
                    <div class="po-features">
                        <div class="po-feature">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                            {{ produit.equipe || produit.marque || 'Premium' }}
                        </div>
                        <div class="po-feature">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                            100 % personnalisable
                        </div>
                        <div class="po-feature">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                            Livraison 2 jours max
                        </div>
                    </div>
                </div>

                <!-- ══ COLONNE CONFIG ══ -->
                <div class="po-config">

                    <!-- En-tête produit -->
                    <span class="po-config__kicker">{{ labelCategorie(produit.categorie) }}</span>
                    <h1 class="po-config__title">{{ produit.nom }}</h1>

                    <div class="po-config__price-row">
                        <div class="po-config__price">
                            <strong>{{ formatPrix(prixTotal()) }}</strong>
                            <span>FCFA</span>
                        </div>
                        <!-- Badges Sur commande -->
                        <div class="po-sur-commande">
                            <span class="po-sur-commande__badge">⏱ Sur commande</span>
                            <span class="po-sur-commande__delai">🚚 2 jours max</span>
                        </div>
                    </div>

                    <p class="po-config__desc">{{ produit.description || 'Maillot officiel de haute qualité avec finitions premium.' }}</p>

                    <div class="po-divider"></div>

                    <!-- Taille -->
                    <div class="po-selector">
                        <div class="po-selector__header">
                            <span class="po-selector__label">Taille</span>
                            <strong *ngIf="tailleSelectionnee" class="po-selector__selected">{{ tailleSelectionnee }}</strong>
                        </div>
                        <div class="po-chip-row">
                            <button *ngFor="let t of taillesDisponibles"
                                    class="po-chip"
                                    [class.po-chip--active]="tailleSelectionnee === t"
                                    (click)="tailleSelectionnee = t">{{ t }}</button>
                        </div>
                    </div>

                    <!-- Couleur -->
                    <div class="po-selector">
                        <div class="po-selector__header">
                            <span class="po-selector__label">Couleur</span>
                            <strong *ngIf="couleurSelectionnee" class="po-selector__selected">{{ couleurSelectionnee }}</strong>
                        </div>
                        <div class="po-chip-row">
                            <button *ngFor="let c of couleursDisponibles"
                                    class="po-chip"
                                    [class.po-chip--active]="couleurSelectionnee === c"
                                    (click)="couleurSelectionnee = c">{{ c }}</button>
                        </div>
                    </div>

                    <div class="po-divider"></div>

                    <!-- Options premium -->
                    <div class="po-options-card">
                        <h3 class="po-options-card__title">Options personnalisation</h3>

                        <!-- Badges officiels -->
                        <div class="po-option-row" (click)="badgesOfficiels = !badgesOfficiels">
                            <div class="po-option-row__icon po-option-row__icon--gold">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            </div>
                            <div class="po-option-row__info">
                                <span class="po-option-row__name">Badges officiels</span>
                                <span class="po-option-row__desc">Écussons brodés sur les manches</span>
                            </div>
                            <div class="po-option-row__right">
                                <span class="po-option-row__price">+{{ formatPrix(prixBadgesOfficiels) }} FCFA</span>
                                <div class="po-toggle" [class.po-toggle--on]="badgesOfficiels">
                                    <div class="po-toggle__knob"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Flocage -->
                        <div class="po-option-row" (click)="flocage = !flocage">
                            <div class="po-option-row__icon po-option-row__icon--orange">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            </div>
                            <div class="po-option-row__info">
                                <span class="po-option-row__name">Flocage personnalisé</span>
                                <span class="po-option-row__desc">Nom + numéro dans le dos</span>
                            </div>
                            <div class="po-option-row__right">
                                <span class="po-option-row__price">+{{ formatPrix(prixFlocageParLettre) }} FCFA/lettre</span>
                                <div class="po-toggle" [class.po-toggle--on]="flocage">
                                    <div class="po-toggle__knob"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Inputs flocage -->
                        <div *ngIf="flocage" class="po-flocage-zone">
                            <div class="po-flocage-preview-hint">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Saisissez ci-dessous — la prévisualisation s'affiche sur l'image
                            </div>
                            <div class="po-flocage-inputs">
                                <div class="po-input-group">
                                    <label>Nom à floquer</label>
                                    <input class="po-input" type="text" [(ngModel)]="flocageNom" placeholder="Ex : MBAPPÉ" maxlength="20" />
                                </div>
                                <div class="po-input-group">
                                    <label>Numéro</label>
                                    <input class="po-input" type="text" [(ngModel)]="flocageNumero" placeholder="Ex : 10" maxlength="3" />
                                </div>
                            </div>
                            <div *ngIf="prixFlocageTotal() > 0" class="po-flocage-cost">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Coût flocage : {{ formatPrix(prixFlocageTotal()) }} FCFA
                            </div>
                        </div>
                    </div>

                    <!-- Quantité -->
                    <div class="po-qty-row">
                        <span class="po-qty-label">Quantité</span>
                        <div class="po-qty-ctrl">
                            <button class="po-qty-btn" (click)="quantite = quantite - 1" [disabled]="quantite <= 1">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </button>
                            <span class="po-qty-val">{{ quantite }}</span>
                            <button class="po-qty-btn" (click)="quantite = quantite + 1">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </button>
                        </div>
                    </div>

                    <!-- Résumé prix -->
                    <div class="po-summary">
                        <div class="po-summary__line">
                            <span>Maillot × {{ quantite }}</span>
                            <span>{{ formatPrix(produit.prix * quantite) }} FCFA</span>
                        </div>
                        <div class="po-summary__line" *ngIf="badgesOfficiels">
                            <span>Badges officiels</span>
                            <span class="po-summary__plus">+{{ formatPrix(prixBadgesOfficiels * quantite) }} FCFA</span>
                        </div>
                        <div class="po-summary__line" *ngIf="prixFlocageTotal() > 0">
                            <span>Flocage</span>
                            <span class="po-summary__plus">+{{ formatPrix(prixFlocageTotal() * quantite) }} FCFA</span>
                        </div>
                        <div class="po-summary__total">
                            <span>Total</span>
                            <strong>{{ formatPrix(prixTotal()) }} FCFA</strong>
                        </div>
                    </div>

                    <!-- CTAs -->
                    <div class="po-actions">
                        <button class="po-btn po-btn--primary" (click)="ajouterAuPanier()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                            Ajouter au panier
                        </button>
                        <button class="po-btn po-btn--whatsapp" (click)="ajouterAuPanier(true)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                            Commander via WhatsApp
                        </button>
                    </div>

                    <!-- Onglets -->
                    <div class="po-tabs">
                        <div class="po-tabs__nav">
                            <button class="po-tab-btn" [class.po-tab-btn--active]="tabActif === 'desc'" (click)="tabActif = 'desc'">Description</button>
                            <button class="po-tab-btn" [class.po-tab-btn--active]="tabActif === 'livraison'" (click)="tabActif = 'livraison'">Livraison</button>
                        </div>
                        <div class="po-tabs__content">
                            <p *ngIf="tabActif === 'desc'" class="po-tabs__text">
                                {{ produit.description || 'Maillot officiel de haute qualité avec finitions premium.' }}
                            </p>
                            <div *ngIf="tabActif === 'livraison'" class="po-livraison-list">
                                <div class="po-livraison-item">
                                    <div class="po-livraison-item__icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    </div>
                                    <div>
                                        <strong>Sur commande</strong>
                                        <p>Commandé auprès du fournisseur après validation. Préparation sous 24h.</p>
                                    </div>
                                </div>
                                <div class="po-livraison-item">
                                    <div class="po-livraison-item__icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                                    </div>
                                    <div>
                                        <strong>Livraison 2 jours max</strong>
                                        <p>À domicile ou en point relais à Abidjan. Frais confirmés via WhatsApp.</p>
                                    </div>
                                </div>
                                <div class="po-livraison-item">
                                    <div class="po-livraison-item__icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                                    </div>
                                    <div>
                                        <strong>Suivi WhatsApp</strong>
                                        <p>Vous êtes informé(e) à chaque étape : confirmation, expédition, livraison.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host {
            display: block;
            background: #FAF7F2;
            color: #1A1A1A;
            font-family: 'Poppins', 'Segoe UI', sans-serif;
            min-height: 100vh;
        }

        /* ── Container ── */
        .po-shell { padding-bottom: 4rem; }

        .po-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }

        /* ── Breadcrumb ── */
        .po-breadcrumb {
            padding: 1rem 0;
            border-bottom: 1px solid rgba(0,0,0,0.06);
            margin-bottom: 2rem;
        }

        .po-breadcrumb .po-container {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.82rem;
        }

        .po-crumb-link {
            color: #8B7355;
            text-decoration: none;
            transition: color 0.2s;
        }
        .po-crumb-link:hover { color: #1A1A1A; }
        .po-crumb-sep { color: #AAAAAA; }
        .po-crumb-current { color: #1A1A1A; font-weight: 500; }

        /* ── Skeleton ── */
        .po-skeleton-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            padding-top: 1rem;
        }

        /* ── Grid principal ── */
        .po-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: start;
        }

        /* ══════════════════════════
           COLONNE IMAGE
        ══════════════════════════ */
        .po-media__frame {
            position: relative;
            border-radius: 1.25rem;
            overflow: hidden;
            background: #FFFFFF;
            border: 1px solid rgba(0,0,0,0.07);
            aspect-ratio: 3 / 4;
            box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }

        .po-media__cat-badge {
            position: absolute;
            top: 1rem;
            left: 1rem;
            z-index: 3;
            padding: 0.28rem 0.7rem;
            background: #1A1A1A;
            color: #fff;
            font-size: 0.6rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            border-radius: 999px;
        }

        .po-media__stock {
            position: absolute;
            top: 1rem;
            right: 1rem;
            z-index: 3;
            display: flex;
            align-items: center;
            gap: 0.3rem;
            padding: 0.28rem 0.7rem;
            background: rgba(0,200,81,0.12);
            border: 1px solid rgba(0,200,81,0.3);
            color: #00a844;
            font-size: 0.62rem;
            font-weight: 600;
            border-radius: 999px;
        }
        .po-media__stock--low {
            background: rgba(245,166,35,0.12);
            border-color: rgba(245,166,35,0.3);
            color: #c47d00;
        }

        .po-media__img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.5s ease;
        }
        .po-media__frame:hover .po-media__img { transform: scale(1.03); }

        /* ═══ OVERLAY BADGES ═══ */
        .po-overlay-badges {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 4;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.4rem;
            animation: overlayFadeIn 0.3s ease;
        }

        .po-overlay-badges__patch {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #7a4500;
            box-shadow: 0 4px 12px rgba(255,165,0,0.4);
            border: 2.5px solid rgba(255,255,255,0.7);
        }

        .po-overlay-badges__label {
            background: rgba(0,0,0,0.65);
            color: #FFD700;
            font-size: 0.68rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            padding: 0.25rem 0.65rem;
            border-radius: 999px;
            backdrop-filter: blur(4px);
        }

        /* ═══ OVERLAY FLOCAGE ═══ */
        .po-overlay-flocage {
            position: absolute;
            bottom: 18%;
            left: 50%;
            transform: translateX(-50%);
            z-index: 4;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0;
            pointer-events: none;
            animation: overlayFadeIn 0.2s ease;
        }

        .po-overlay-flocage__nom {
            font-family: 'Impact', 'Arial Black', 'Poppins', sans-serif;
            font-size: clamp(1.1rem, 3.5vw, 1.8rem);
            font-weight: 900;
            letter-spacing: 0.12em;
            color: #FFFFFF;
            text-shadow:
                2px 2px 0 #000,
                -2px 2px 0 #000,
                2px -2px 0 #000,
                -2px -2px 0 #000,
                0 3px 8px rgba(0,0,0,0.5);
            line-height: 1.1;
            white-space: nowrap;
        }

        .po-overlay-flocage__numero {
            font-family: 'Impact', 'Arial Black', 'Poppins', sans-serif;
            font-size: clamp(1.8rem, 6vw, 3.2rem);
            font-weight: 900;
            color: #FFFFFF;
            text-shadow:
                2px 2px 0 #000,
                -2px 2px 0 #000,
                2px -2px 0 #000,
                -2px -2px 0 #000,
                0 4px 12px rgba(0,0,0,0.6);
            line-height: 1;
        }

        .po-media__dos-hint {
            position: absolute;
            bottom: 0.75rem;
            left: 50%;
            transform: translateX(-50%);
            z-index: 5;
            display: flex;
            align-items: center;
            gap: 0.3rem;
            background: rgba(0,0,0,0.55);
            color: rgba(255,255,255,0.85);
            font-size: 0.67rem;
            font-weight: 500;
            padding: 0.25rem 0.7rem;
            border-radius: 999px;
            backdrop-filter: blur(4px);
            white-space: nowrap;
        }

        @keyframes overlayFadeIn {
            from { opacity: 0; transform: translateX(-50%) translateY(6px); }
            to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* Options actives sous image */
        .po-media__options-actives {
            display: flex;
            gap: 0.4rem;
            flex-wrap: wrap;
            margin-top: 0.75rem;
        }

        .po-option-chip {
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.3rem 0.75rem;
            border-radius: 999px;
        }

        .po-option-chip--badges {
            background: rgba(255,215,0,0.15);
            border: 1px solid rgba(255,165,0,0.35);
            color: #a06200;
        }

        .po-option-chip--flocage {
            background: rgba(255,107,53,0.12);
            border: 1px solid rgba(255,107,53,0.3);
            color: #c84b00;
        }

        /* Caractéristiques */
        .po-features {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
            margin-top: 1rem;
        }

        .po-feature {
            display: flex;
            align-items: center;
            gap: 0.35rem;
            padding: 0.35rem 0.75rem;
            background: #FFFFFF;
            border: 1px solid rgba(0,0,0,0.08);
            border-radius: 999px;
            font-size: 0.75rem;
            color: #555;
        }

        .po-feature svg { color: #FF6B35; flex-shrink: 0; }

        /* ══════════════════════════
           COLONNE CONFIG
        ══════════════════════════ */
        .po-config { padding-top: 0.25rem; }

        .po-config__kicker {
            display: inline-block;
            font-size: 0.62rem;
            font-weight: 700;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #FF6B35;
            margin-bottom: 0.6rem;
        }

        .po-config__title {
            font-size: clamp(1.7rem, 2.8vw, 2.4rem);
            font-weight: 800;
            line-height: 1.1;
            color: #1A1A1A;
            margin: 0 0 1rem;
            letter-spacing: -0.01em;
        }

        .po-config__price-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-bottom: 1rem;
        }

        .po-config__price {
            display: flex;
            align-items: baseline;
            gap: 0.35rem;
        }

        .po-config__price strong {
            font-size: 2rem;
            font-weight: 800;
            color: #FF6B35;
            line-height: 1;
        }

        .po-config__price span {
            font-size: 0.9rem;
            color: #888;
        }

        .po-config__desc {
            font-size: 0.88rem;
            color: #666;
            line-height: 1.7;
            margin: 0 0 1rem;
        }

        .po-divider {
            height: 1px;
            background: rgba(0,0,0,0.07);
            margin: 1rem 0;
        }

        /* Sur commande badges */
        .po-sur-commande { display: flex; gap: 0.5rem; flex-wrap: wrap; }

        .po-sur-commande__badge {
            font-size: 0.72rem;
            font-weight: 600;
            padding: 0.25rem 0.65rem;
            background: rgba(255,107,53,0.1);
            border: 1px solid rgba(255,107,53,0.3);
            color: #c84b00;
            border-radius: 999px;
        }

        .po-sur-commande__delai {
            font-size: 0.72rem;
            padding: 0.25rem 0.65rem;
            background: rgba(0,0,0,0.04);
            border: 1px solid rgba(0,0,0,0.1);
            color: #666;
            border-radius: 999px;
        }

        /* Sélecteurs taille/couleur */
        .po-selector { margin-bottom: 1.1rem; }

        .po-selector__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.55rem;
        }

        .po-selector__label {
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #888;
        }

        .po-selector__selected {
            font-size: 0.82rem;
            color: #FF6B35;
            font-weight: 700;
        }

        .po-chip-row { display: flex; flex-wrap: wrap; gap: 0.4rem; }

        .po-chip {
            padding: 0.42rem 0.9rem;
            background: #FFFFFF;
            border: 1.5px solid rgba(0,0,0,0.12);
            border-radius: 0.5rem;
            color: #444;
            font-size: 0.82rem;
            font-weight: 500;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: all 0.18s ease;
        }

        .po-chip:hover {
            border-color: #FF6B35;
            color: #FF6B35;
        }

        .po-chip--active {
            background: #FF6B35;
            border-color: #FF6B35;
            color: #FFFFFF;
        }

        /* Options premium card */
        .po-options-card {
            background: #FFFFFF;
            border: 1px solid rgba(0,0,0,0.08);
            border-radius: 1rem;
            padding: 1.1rem;
            margin-bottom: 1.1rem;
            box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        .po-options-card__title {
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #AAAAAA;
            margin: 0 0 0.85rem;
        }

        .po-option-row {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 0;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            cursor: pointer;
            transition: background 0.15s;
            border-radius: 0.5rem;
            padding: 0.75rem 0.5rem;
            margin: 0 -0.5rem;
        }
        .po-option-row:last-of-type { border-bottom: none; }
        .po-option-row:hover { background: rgba(0,0,0,0.02); }

        .po-option-row__icon {
            width: 34px;
            height: 34px;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .po-option-row__icon--gold {
            background: rgba(255,215,0,0.15);
            border: 1px solid rgba(255,165,0,0.25);
            color: #b07800;
        }

        .po-option-row__icon--orange {
            background: rgba(255,107,53,0.1);
            border: 1px solid rgba(255,107,53,0.2);
            color: #FF6B35;
        }

        .po-option-row__info { flex: 1; min-width: 0; }

        .po-option-row__name {
            display: block;
            font-size: 0.88rem;
            font-weight: 600;
            color: #1A1A1A;
        }

        .po-option-row__desc {
            display: block;
            font-size: 0.73rem;
            color: #AAAAAA;
        }

        .po-option-row__right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.3rem;
            flex-shrink: 0;
        }

        .po-option-row__price {
            font-size: 0.72rem;
            font-weight: 600;
            color: #888;
        }

        /* Toggle */
        .po-toggle {
            width: 42px;
            height: 23px;
            border-radius: 999px;
            background: #E5E7EB;
            border: 1.5px solid rgba(0,0,0,0.1);
            position: relative;
            cursor: pointer;
            transition: background 0.25s, border-color 0.25s;
        }

        .po-toggle--on {
            background: #FF6B35;
            border-color: #FF6B35;
        }

        .po-toggle__knob {
            position: absolute;
            top: 2.5px;
            left: 2.5px;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: #FFFFFF;
            box-shadow: 0 1px 4px rgba(0,0,0,0.2);
            transition: transform 0.25s ease;
        }

        .po-toggle--on .po-toggle__knob { transform: translateX(19px); }

        /* Flocage inputs */
        .po-flocage-zone {
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 1px solid rgba(0,0,0,0.06);
        }

        .po-flocage-preview-hint {
            display: flex;
            align-items: center;
            gap: 0.35rem;
            font-size: 0.72rem;
            color: #FF6B35;
            font-weight: 500;
            margin-bottom: 0.65rem;
        }

        .po-flocage-inputs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.6rem;
        }

        .po-input-group {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
        }

        .po-input-group label {
            font-size: 0.7rem;
            color: #999;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }

        .po-input {
            width: 100%;
            padding: 0.55rem 0.75rem;
            background: #FAF7F2;
            border: 1.5px solid rgba(0,0,0,0.12);
            border-radius: 0.5rem;
            color: #1A1A1A;
            font-size: 0.85rem;
            font-family: 'Poppins', sans-serif;
            outline: none;
            transition: border-color 0.2s;
            box-sizing: border-box;
        }

        .po-input:focus {
            border-color: #FF6B35;
            box-shadow: 0 0 0 3px rgba(255,107,53,0.1);
        }

        .po-flocage-cost {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.78rem;
            color: #888;
            margin-top: 0.5rem;
        }

        /* Quantité */
        .po-qty-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
        }

        .po-qty-label {
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #888;
        }

        .po-qty-ctrl {
            display: flex;
            align-items: center;
            background: #FFFFFF;
            border: 1.5px solid rgba(0,0,0,0.12);
            border-radius: 0.65rem;
            overflow: hidden;
        }

        .po-qty-btn {
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            color: #555;
            cursor: pointer;
            transition: all 0.18s;
        }

        .po-qty-btn:hover:not(:disabled) {
            background: #FAF7F2;
            color: #1A1A1A;
        }

        .po-qty-btn:disabled { opacity: 0.3; cursor: default; }

        .po-qty-val {
            min-width: 44px;
            text-align: center;
            font-size: 0.95rem;
            font-weight: 700;
            color: #1A1A1A;
            border-left: 1px solid rgba(0,0,0,0.08);
            border-right: 1px solid rgba(0,0,0,0.08);
            line-height: 38px;
        }

        /* Résumé prix */
        .po-summary {
            background: #FFFFFF;
            border: 1px solid rgba(0,0,0,0.08);
            border-radius: 1rem;
            padding: 1rem;
            margin-bottom: 1.1rem;
            box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        .po-summary__line {
            display: flex;
            justify-content: space-between;
            font-size: 0.86rem;
            color: #888;
            padding: 0.28rem 0;
        }

        .po-summary__plus { color: #FF6B35; font-weight: 600; }

        .po-summary__total {
            display: flex;
            justify-content: space-between;
            font-size: 1rem;
            padding-top: 0.6rem;
            margin-top: 0.35rem;
            border-top: 1px solid rgba(0,0,0,0.07);
        }

        .po-summary__total span { color: #444; font-weight: 600; }

        .po-summary__total strong {
            font-size: 1.25rem;
            font-weight: 800;
            color: #FF6B35;
        }

        /* CTAs */
        .po-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
            margin-bottom: 1.4rem;
        }

        .po-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.85rem 1rem;
            border-radius: 0.75rem;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            border: none;
            font-family: 'Poppins', sans-serif;
            transition: all 0.22s ease;
        }

        .po-btn--primary {
            background: #1A1A1A;
            color: #FFFFFF;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }

        .po-btn--primary:hover {
            background: #333;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }

        .po-btn--whatsapp {
            background: rgba(37,211,102,0.1);
            color: #18a34a;
            border: 1.5px solid rgba(37,211,102,0.35);
        }

        .po-btn--whatsapp:hover {
            background: rgba(37,211,102,0.18);
            border-color: rgba(37,211,102,0.6);
        }

        /* Onglets */
        .po-tabs {
            background: #FFFFFF;
            border: 1px solid rgba(0,0,0,0.08);
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        .po-tabs__nav {
            display: flex;
            border-bottom: 1px solid rgba(0,0,0,0.07);
        }

        .po-tab-btn {
            flex: 1;
            padding: 0.75rem;
            background: transparent;
            border: none;
            color: #999;
            font-size: 0.82rem;
            font-weight: 600;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: all 0.18s;
            letter-spacing: 0.04em;
        }

        .po-tab-btn:hover { color: #555; }

        .po-tab-btn--active {
            color: #FF6B35;
            background: rgba(255,107,53,0.05);
            border-bottom: 2px solid #FF6B35;
        }

        .po-tabs__content { padding: 1rem; }

        .po-tabs__text {
            color: #666;
            font-size: 0.88rem;
            line-height: 1.7;
            margin: 0;
        }

        /* Livraison */
        .po-livraison-list {
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
        }

        .po-livraison-item {
            display: flex;
            gap: 0.75rem;
            align-items: flex-start;
        }

        .po-livraison-item__icon {
            width: 32px;
            height: 32px;
            border-radius: 0.5rem;
            background: rgba(255,107,53,0.1);
            border: 1px solid rgba(255,107,53,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FF6B35;
            flex-shrink: 0;
        }

        .po-livraison-item strong {
            display: block;
            font-size: 0.85rem;
            color: #1A1A1A;
            margin-bottom: 0.15rem;
        }

        .po-livraison-item p {
            font-size: 0.8rem;
            color: #888;
            margin: 0;
            line-height: 1.5;
        }

        /* ═══ RESPONSIVE ═══ */
        @media (max-width: 1024px) {
            .po-grid, .po-skeleton-grid { grid-template-columns: 1fr; gap: 1.75rem; }
            .po-media__frame { max-height: 480px; }
        }

        @media (max-width: 640px) {
            .po-container { padding: 0 1rem; }
            .po-config__title { font-size: 1.6rem; }
            .po-actions { grid-template-columns: 1fr; }
            .po-flocage-inputs { grid-template-columns: 1fr; }
            .po-config__price-row { flex-direction: column; align-items: flex-start; gap: 0.4rem; }
        }
    `]
})
export class ProductOverviewComponent implements OnInit {
    private route      = inject(ActivatedRoute);
    private router     = inject(Router);
    public  produitService = inject(ProduitService);
    private panierService  = inject(PanierService);
    private messageService = inject(MessageService);
    private analytics      = inject(AnalyticsService);
    private metaService    = inject(MetaService);

    produit: Produit | null = null;
    chargement = true;
    tabActif: 'desc' | 'livraison' = 'desc';

    quantite = 1;
    tailleSelectionnee = '';
    couleurSelectionnee = 'Standard';
    badgesOfficiels = false;
    flocage = false;
    flocageNom = '';
    flocageNumero = '';

    taillesDisponibles: string[] = ['M', 'L', 'XL', 'XXL'];
    couleursDisponibles: string[] = ['Standard'];
    readonly prixBadgesOfficiels = 500;
    readonly prixFlocageParLettre = 500;
    private readonly fallbackImage = '/images/app/login.png';

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) { this.router.navigate(['/boutique']); return; }

        this.produitService.getProduitById(id).subscribe({
            next: (data) => {
                this.produit = data;
                this.taillesDisponibles    = data.taillesDisponibles?.length  ? data.taillesDisponibles  : ['M', 'L', 'XL', 'XXL'];
                this.couleursDisponibles   = data.couleursDisponibles?.length ? data.couleursDisponibles : ['Standard'];
                this.tailleSelectionnee   = this.taillesDisponibles[0];
                this.couleurSelectionnee  = this.couleursDisponibles[0];
                this.chargement = false;
                this.metaService.setProduit(data.nom, data.description ?? null, data.imageUrl ?? null, data.id, data.prix);
                this.analytics.trackViewItem({ id: data.id, nom: data.nom, prix: data.prix });
            },
            error: () => {
                this.chargement = false;
                this.messageService.add({ severity: 'warn', summary: 'Produit introuvable', detail: 'Ce produit n\'est plus disponible.', life: 3000 });
                this.router.navigate(['/boutique']);
            }
        });
    }

    prixOptionsUnitaire(): number {
        return (this.badgesOfficiels ? this.prixBadgesOfficiels : 0) + this.prixFlocageTotal();
    }

    prixFlocageTotal(): number {
        if (!this.flocage) return 0;
        return ((this.flocageNom || '').trim().length + (this.flocageNumero || '').trim().length) * this.prixFlocageParLettre;
    }

    prixTotal(): number {
        if (!this.produit) return 0;
        return (this.produit.prix + this.prixOptionsUnitaire()) * this.quantite;
    }

    stockLabel(): string {
        if (!this.produit) return '';
        if (!this.produit.enStock || this.produit.stockTotal <= 0) return 'Rupture';
        if (this.produit.stockTotal < 8) return 'Stock faible';
        return 'En stock';
    }

    labelCategorie(categorie: string): string {
        const map: Record<string, string> = {
            'actuel': 'MAILLOT ACTUEL', 'vintage-court': 'VINTAGE COURT',
            'vintage-long': 'VINTAGE LONG', 'collection': 'COLLECTION'
        };
        return map[categorie] ?? 'ÉDITION SPÉCIALE';
    }

    ajouterAuPanier(allerPanier = false): void {
        if (!this.produit || !this.tailleSelectionnee || !this.couleurSelectionnee) {
            this.messageService.add({ severity: 'warn', summary: 'Sélection incomplète', detail: 'Veuillez choisir une taille et une couleur.' });
            return;
        }
        if (this.flocage && !this.flocageNom.trim() && !this.flocageNumero.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Flocage manquant', detail: 'Veuillez saisir un nom ou un numéro.' });
            return;
        }

        const options: OptionsMaillot = {
            taille: this.tailleSelectionnee,
            couleur: this.couleurSelectionnee,
            badgesOfficiels: this.badgesOfficiels,
            flocage: this.flocage,
            flocageNom:    this.flocage ? this.flocageNom    : undefined,
            flocageNumero: this.flocage ? this.flocageNumero : undefined,
            flocageTexte:  this.flocage ? [this.flocageNom, this.flocageNumero].filter(v => v?.trim()).join(' ') : undefined
        };

        this.panierService.ajouterAuPanier(this.produit, options, this.quantite, this.prixOptionsUnitaire());
        this.messageService.add({ severity: 'success', summary: 'Ajouté au panier', detail: 'Votre maillot a été ajouté avec vos options.' });
        if (allerPanier) this.router.navigate(['/boutique/panier']);
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement | null;
        if (img && !img.src.includes(this.fallbackImage)) img.src = this.fallbackImage;
    }

    formatPrix(prix: number): string {
        return new Intl.NumberFormat('fr-FR').format(prix);
    }
}
