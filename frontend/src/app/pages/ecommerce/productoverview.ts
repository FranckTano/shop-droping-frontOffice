import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProduitService, Produit } from '@services/produit.service';
import { PanierService, OptionsMaillot } from '@services/panier.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-product-overview',
    standalone: true,
    imports: [
        CommonModule, FormsModule, InputNumberModule, ButtonModule,
        RippleModule, CheckboxModule, InputTextModule, ToastModule, SkeletonModule
    ],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>

        <div class="po-shell">

            <!-- TOPBAR NAV -->
            <div class="po-topbar">
                <div class="po-container">
                    <button class="po-back-btn" (click)="retourBoutique()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                        Retour à la boutique
                    </button>
                    <button class="po-cart-btn" (click)="allerAuPanier()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                        Voir le panier
                    </button>
                </div>
            </div>

            <!-- SKELETON -->
            <div *ngIf="chargement" class="po-container">
                <div class="po-grid">
                    <p-skeleton height="580px" borderRadius="1rem"></p-skeleton>
                    <div style="padding: 1rem;">
                        <p-skeleton width="40%" height="1rem" styleClass="mb-3"></p-skeleton>
                        <p-skeleton width="75%" height="2.5rem" styleClass="mb-2"></p-skeleton>
                        <p-skeleton width="30%" height="2rem" styleClass="mb-4"></p-skeleton>
                        <p-skeleton height="1px" styleClass="mb-4"></p-skeleton>
                        <p-skeleton height="5rem" styleClass="mb-3"></p-skeleton>
                        <p-skeleton height="5rem" styleClass="mb-3"></p-skeleton>
                        <p-skeleton height="4rem"></p-skeleton>
                    </div>
                </div>
            </div>

            <!-- PRODUCT DETAIL -->
            <div *ngIf="!chargement && produit" class="po-container">
                <div class="po-grid">

                    <!-- IMAGE COLUMN -->
                    <div class="po-media">
                        <div class="po-media__frame">
                            <span class="po-media__badge">{{ produit.categorie | uppercase }}</span>
                            <span class="po-media__stock" [class.po-media__stock--low]="produit.stockTotal > 0 && produit.stockTotal < 8">
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4"/></svg>
                                {{ stockLabel() }}
                            </span>
                            <img
                                [src]="produitService.resolveImageUrl(produit.imageUrl)"
                                [alt]="produit.nom"
                                class="po-media__img"
                                loading="lazy"
                                (error)="onImageError($event)" />
                            <div class="po-media__glow"></div>
                        </div>

                        <!-- Feature pills -->
                        <div class="po-features">
                            <div class="po-feature">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                                <span>{{ produit.equipe }}</span>
                            </div>
                            <div class="po-feature">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                                <span>100% personnalisable</span>
                            </div>
                            <div class="po-feature">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                <span>{{ produit.marque || 'Premium quality' }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- INFO COLUMN -->
                    <div class="po-info">

                        <span class="po-info__kicker">{{ labelCategorie(produit.categorie) }}</span>
                        <h1 class="po-info__title">{{ produit.nom }}</h1>

                        <div class="po-info__price">
                            <strong>{{ formatPrix(produit.prix) }}</strong>
                            <span>FCFA</span>
                        </div>

                        <p class="po-info__desc">{{ produit.description || 'Maillot officiel de haute qualité avec finitions premium.' }}</p>

                        <div class="po-divider"></div>

                        <!-- Taille -->
                        <div class="po-selector">
                            <div class="po-selector__label">
                                <span>Taille</span>
                                <strong *ngIf="tailleSelectionnee">{{ tailleSelectionnee }}</strong>
                            </div>
                            <div class="po-chip-row">
                                <button
                                    *ngFor="let taille of taillesDisponibles"
                                    class="po-chip"
                                    [class.po-chip--active]="tailleSelectionnee === taille"
                                    (click)="tailleSelectionnee = taille">
                                    {{ taille }}
                                </button>
                            </div>
                        </div>

                        <!-- Couleur -->
                        <div class="po-selector">
                            <div class="po-selector__label">
                                <span>Couleur</span>
                                <strong *ngIf="couleurSelectionnee">{{ couleurSelectionnee }}</strong>
                            </div>
                            <div class="po-chip-row">
                                <button
                                    *ngFor="let couleur of couleursDisponibles"
                                    class="po-chip"
                                    [class.po-chip--active]="couleurSelectionnee === couleur"
                                    (click)="couleurSelectionnee = couleur">
                                    {{ couleur }}
                                </button>
                            </div>
                        </div>

                        <!-- Options premium -->
                        <div class="po-options">
                            <h3 class="po-options__title">Options premium</h3>

                            <label class="po-option-toggle">
                                <div class="po-option-toggle__left">
                                    <div class="po-option-toggle__icon">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                                    </div>
                                    <div>
                                        <span class="po-option-toggle__name">Badges officiels</span>
                                        <span class="po-option-toggle__price">+{{ formatPrix(prixBadgesOfficiels) }} FCFA</span>
                                    </div>
                                </div>
                                <div class="po-toggle-switch" [class.po-toggle-switch--on]="badgesOfficiels" (click)="badgesOfficiels = !badgesOfficiels">
                                    <div class="po-toggle-switch__knob"></div>
                                </div>
                            </label>

                            <label class="po-option-toggle">
                                <div class="po-option-toggle__left">
                                    <div class="po-option-toggle__icon">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                    </div>
                                    <div>
                                        <span class="po-option-toggle__name">Flocage personnalisé</span>
                                        <span class="po-option-toggle__price">+{{ formatPrix(prixFlocageParLettre) }} FCFA / lettre</span>
                                    </div>
                                </div>
                                <div class="po-toggle-switch" [class.po-toggle-switch--on]="flocage" (click)="flocage = !flocage">
                                    <div class="po-toggle-switch__knob"></div>
                                </div>
                            </label>

                            <div *ngIf="flocage" class="po-flocage-inputs">
                                <div class="po-input-group">
                                    <label>Nom à floquer</label>
                                    <input pInputText [(ngModel)]="flocageNom" placeholder="Ex: MBAPPÉ" class="po-input" />
                                </div>
                                <div class="po-input-group">
                                    <label>Numéro</label>
                                    <input pInputText [(ngModel)]="flocageNumero" placeholder="Ex: 10" class="po-input" />
                                </div>
                                <div class="po-flocage-cost" *ngIf="prixFlocageTotal() > 0">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF4500" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
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
                                <span>Maillot</span>
                                <span>{{ formatPrix(produit.prix) }} FCFA</span>
                            </div>
                            <div class="po-summary__line" *ngIf="prixOptionsUnitaire() > 0">
                                <span>Options</span>
                                <span class="po-summary__accent">+{{ formatPrix(prixOptionsUnitaire()) }} FCFA</span>
                            </div>
                            <div class="po-summary__line" *ngIf="quantite > 1">
                                <span>Quantité</span>
                                <span>× {{ quantite }}</span>
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
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                                Commander via WhatsApp
                            </button>
                        </div>

                        <!-- Tabs description/livraison -->
                        <div class="po-tabs">
                            <div class="po-tabs__nav">
                                <button class="po-tab-btn" [class.po-tab-btn--active]="tabActif === 'desc'" (click)="tabActif = 'desc'">Description</button>
                                <button class="po-tab-btn" [class.po-tab-btn--active]="tabActif === 'livraison'" (click)="tabActif = 'livraison'">Livraison</button>
                            </div>
                            <div class="po-tabs__content">
                                <p *ngIf="tabActif === 'desc'">
                                    {{ produit.description || 'Maillot officiel de haute qualité avec finitions premium.' }}
                                </p>
                                <p *ngIf="tabActif === 'livraison'">
                                    Livraison à domicile ou en point relais. Les frais exacts sont confirmés lors de la validation via WhatsApp. Préparation sous 24h après confirmation de commande.
                                </p>
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
            background: #0a0a0a;
            color: #ffffff;
            font-family: 'Poppins', 'Segoe UI', sans-serif;
            min-height: 100vh;
        }

        .po-shell {
            padding-bottom: 5rem;
        }

        .po-container {
            max-width: 1320px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }

        /* ===== TOPBAR ===== */
        .po-topbar {
            padding: 1.5rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            margin-bottom: 2rem;
        }

        .po-topbar .po-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }

        .po-back-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 0.5rem;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.82rem;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: all 0.2s ease;
        }

        .po-back-btn:hover {
            border-color: rgba(255, 255, 255, 0.3);
            color: #ffffff;
        }

        .po-cart-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1.2rem;
            background: rgba(255, 69, 0, 0.1);
            border: 1px solid rgba(255, 69, 0, 0.25);
            border-radius: 0.5rem;
            color: #FF4500;
            font-size: 0.82rem;
            font-weight: 600;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: all 0.2s ease;
        }

        .po-cart-btn:hover {
            background: rgba(255, 69, 0, 0.18);
            border-color: rgba(255, 69, 0, 0.5);
        }

        /* ===== GRID ===== */
        .po-grid {
            display: grid;
            grid-template-columns: 1.05fr 1fr;
            gap: 3rem;
            align-items: start;
        }

        /* ===== MEDIA ===== */
        .po-media__frame {
            position: relative;
            border-radius: 1.2rem;
            overflow: hidden;
            background: #111111;
            border: 1px solid rgba(255, 255, 255, 0.07);
            aspect-ratio: 4 / 5;
        }

        .po-media__badge {
            position: absolute;
            top: 1rem;
            left: 1rem;
            z-index: 2;
            padding: 0.3rem 0.75rem;
            background: rgba(255, 69, 0, 0.9);
            color: #fff;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            border-radius: 999px;
            backdrop-filter: blur(4px);
        }

        .po-media__stock {
            position: absolute;
            top: 1rem;
            right: 1rem;
            z-index: 2;
            display: flex;
            align-items: center;
            gap: 0.35rem;
            padding: 0.3rem 0.75rem;
            background: rgba(0, 200, 81, 0.15);
            border: 1px solid rgba(0, 200, 81, 0.3);
            color: #00C851;
            font-size: 0.65rem;
            font-weight: 600;
            border-radius: 999px;
        }

        .po-media__stock--low {
            background: rgba(245, 166, 35, 0.15);
            border-color: rgba(245, 166, 35, 0.3);
            color: #F5A623;
        }

        .po-media__img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.5s ease;
        }

        .po-media__frame:hover .po-media__img { transform: scale(1.03); }

        .po-media__glow {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 40%;
            background: linear-gradient(to top, rgba(255, 69, 0, 0.08), transparent);
            pointer-events: none;
        }

        .po-features {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1rem;
        }

        .po-feature {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.4rem 0.75rem;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 999px;
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.55);
        }

        .po-feature svg { color: rgba(255, 69, 0, 0.7); flex-shrink: 0; }

        /* ===== INFO ===== */
        .po-info {
            padding-top: 0.5rem;
        }

        .po-info__kicker {
            display: inline-block;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.2em;
            color: #FF4500;
            margin-bottom: 0.75rem;
        }

        .po-info__title {
            font-size: clamp(1.8rem, 3vw, 2.5rem);
            font-weight: 800;
            line-height: 1.1;
            color: #ffffff;
            margin: 0 0 1rem;
            letter-spacing: -0.01em;
        }

        .po-info__price {
            display: flex;
            align-items: baseline;
            gap: 0.4rem;
            margin-bottom: 1rem;
        }

        .po-info__price strong {
            font-size: 2.2rem;
            font-weight: 800;
            color: #FF4500;
            line-height: 1;
        }

        .po-info__price span {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.45);
        }

        .po-info__desc {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.9rem;
            line-height: 1.7;
            margin: 0 0 1.2rem;
        }

        .po-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.07);
            margin: 1.2rem 0;
        }

        /* ===== SELECTORS ===== */
        .po-selector {
            margin-bottom: 1.2rem;
        }

        .po-selector__label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.6rem;
        }

        .po-selector__label span {
            font-size: 0.82rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.5);
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        .po-selector__label strong {
            font-size: 0.82rem;
            color: #FF4500;
        }

        .po-chip-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
        }

        .po-chip {
            padding: 0.45rem 0.9rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 0.5rem;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.82rem;
            font-weight: 500;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: all 0.2s ease;
        }

        .po-chip:hover {
            border-color: rgba(255, 255, 255, 0.25);
            color: #ffffff;
        }

        .po-chip--active {
            background: rgba(255, 69, 0, 0.15);
            border-color: rgba(255, 69, 0, 0.5);
            color: #FF4500;
        }

        /* ===== OPTIONS ===== */
        .po-options {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 1rem;
            padding: 1rem;
            margin-bottom: 1.2rem;
        }

        .po-options__title {
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.4);
            margin: 0 0 0.9rem;
        }

        .po-option-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            padding: 0.75rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            cursor: pointer;
        }

        .po-option-toggle:last-of-type { border-bottom: none; }

        .po-option-toggle__left {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .po-option-toggle__icon {
            width: 32px;
            height: 32px;
            border-radius: 0.5rem;
            background: rgba(255, 69, 0, 0.1);
            border: 1px solid rgba(255, 69, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FF4500;
            flex-shrink: 0;
        }

        .po-option-toggle__name {
            display: block;
            font-size: 0.88rem;
            font-weight: 600;
            color: #ffffff;
        }

        .po-option-toggle__price {
            display: block;
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.4);
        }

        /* Toggle switch */
        .po-toggle-switch {
            width: 44px;
            height: 24px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
            position: relative;
            cursor: pointer;
            transition: background 0.25s ease, border-color 0.25s ease;
            flex-shrink: 0;
        }

        .po-toggle-switch--on {
            background: rgba(255, 69, 0, 0.3);
            border-color: rgba(255, 69, 0, 0.5);
        }

        .po-toggle-switch__knob {
            position: absolute;
            top: 3px;
            left: 3px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transition: transform 0.25s ease, background 0.25s ease;
        }

        .po-toggle-switch--on .po-toggle-switch__knob {
            transform: translateX(20px);
            background: #FF4500;
        }

        /* Flocage inputs */
        .po-flocage-inputs {
            margin-top: 0.8rem;
            padding-top: 0.8rem;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
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
            font-size: 0.72rem;
            color: rgba(255, 255, 255, 0.4);
            letter-spacing: 0.05em;
        }

        .po-input {
            width: 100%;
            padding: 0.55rem 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 0.5rem;
            color: #ffffff !important;
            font-size: 0.85rem;
            font-family: 'Poppins', sans-serif;
            outline: none;
            transition: border-color 0.2s ease;
        }

        .po-input:focus {
            border-color: rgba(255, 69, 0, 0.4) !important;
        }

        ::ng-deep .po-input.p-inputtext {
            background: rgba(255, 255, 255, 0.05) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 0.5rem !important;
            color: #ffffff !important;
        }

        ::ng-deep .po-input.p-inputtext:focus {
            border-color: rgba(255, 69, 0, 0.4) !important;
            box-shadow: none !important;
        }

        .po-flocage-cost {
            grid-column: 1 / -1;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.5);
            margin-top: 0.25rem;
        }

        /* ===== QTY ===== */
        .po-qty-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.2rem;
        }

        .po-qty-label {
            font-size: 0.82rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.5);
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        .po-qty-ctrl {
            display: flex;
            align-items: center;
            gap: 0;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.6rem;
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
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .po-qty-btn:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.08);
            color: #ffffff;
        }

        .po-qty-btn:disabled { opacity: 0.3; cursor: default; }

        .po-qty-val {
            min-width: 42px;
            text-align: center;
            font-size: 0.95rem;
            font-weight: 700;
            color: #ffffff;
            border-left: 1px solid rgba(255, 255, 255, 0.08);
            border-right: 1px solid rgba(255, 255, 255, 0.08);
            line-height: 38px;
        }

        /* ===== SUMMARY ===== */
        .po-summary {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 1rem;
            padding: 1rem;
            margin-bottom: 1.2rem;
        }

        .po-summary__line {
            display: flex;
            justify-content: space-between;
            font-size: 0.87rem;
            color: rgba(255, 255, 255, 0.5);
            padding: 0.3rem 0;
        }

        .po-summary__accent { color: #FF4500; }

        .po-summary__total {
            display: flex;
            justify-content: space-between;
            font-size: 1rem;
            padding-top: 0.65rem;
            margin-top: 0.35rem;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .po-summary__total span { color: rgba(255, 255, 255, 0.7); font-weight: 600; }

        .po-summary__total strong {
            font-size: 1.2rem;
            font-weight: 800;
            color: #FF4500;
        }

        /* ===== ACTIONS ===== */
        .po-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
        }

        .po-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.85rem 1.2rem;
            border-radius: 0.7rem;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            border: none;
            font-family: 'Poppins', sans-serif;
            transition: all 0.25s ease;
        }

        .po-btn--primary {
            background: #FF4500;
            color: #ffffff;
            box-shadow: 0 4px 20px rgba(255, 69, 0, 0.3);
        }

        .po-btn--primary:hover {
            background: #e03d00;
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(255, 69, 0, 0.45);
        }

        .po-btn--whatsapp {
            background: rgba(37, 211, 102, 0.12);
            color: #25D366;
            border: 1px solid rgba(37, 211, 102, 0.3);
        }

        .po-btn--whatsapp:hover {
            background: rgba(37, 211, 102, 0.2);
            border-color: rgba(37, 211, 102, 0.5);
        }

        /* ===== TABS ===== */
        .po-tabs {
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 1rem;
            overflow: hidden;
        }

        .po-tabs__nav {
            display: flex;
            border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .po-tab-btn {
            flex: 1;
            padding: 0.75rem;
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.4);
            font-size: 0.82rem;
            font-weight: 600;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: all 0.2s ease;
            letter-spacing: 0.04em;
        }

        .po-tab-btn:hover { color: rgba(255, 255, 255, 0.7); }

        .po-tab-btn--active {
            color: #FF4500;
            background: rgba(255, 69, 0, 0.06);
            border-bottom: 2px solid #FF4500;
        }

        .po-tabs__content {
            padding: 1rem;
        }

        .po-tabs__content p {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.88rem;
            line-height: 1.7;
            margin: 0;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
            .po-grid {
                grid-template-columns: 1fr;
                gap: 2rem;
            }

            .po-media__frame {
                max-height: 450px;
            }
        }

        @media (max-width: 640px) {
            .po-actions {
                grid-template-columns: 1fr;
            }

            .po-flocage-inputs {
                grid-template-columns: 1fr;
            }

            .po-topbar .po-container {
                flex-wrap: wrap;
            }
        }
    `]
})
export class ProductOverviewComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    public produitService = inject(ProduitService);
    private panierService = inject(PanierService);
    private messageService = inject(MessageService);

    produit: Produit | null = null;
    chargement = true;
    tabActif: 'desc' | 'livraison' = 'desc';

    quantite = 1;
    tailleSelectionnee = '';
    couleurSelectionnee = 'Blanc';
    badgesOfficiels = false;
    flocage = false;
    flocageNom = '';
    flocageNumero = '';

    taillesDisponibles: string[] = ['S', 'M', 'L', 'XL'];
    couleursDisponibles: string[] = ['Standard'];
    readonly prixBadgesOfficiels = 500;
    readonly prixFlocageParLettre = 500;
    private readonly fallbackImage = '/images/app/login.png';

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) {
            this.chargement = false;
            this.router.navigate(['/boutique']);
            return;
        }

        this.produitService.getProduitById(id).subscribe({
            next: (data) => {
                this.produit = data;
                this.taillesDisponibles = data.taillesDisponibles?.length ? data.taillesDisponibles : ['S', 'M', 'L', 'XL'];
                this.couleursDisponibles = data.couleursDisponibles?.length ? data.couleursDisponibles : ['Standard'];
                this.tailleSelectionnee = this.taillesDisponibles[0];
                this.couleurSelectionnee = this.couleursDisponibles[0];
                this.chargement = false;
            },
            error: () => {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Produit introuvable',
                    detail: 'Ce produit n\'est plus disponible.',
                    life: 3000
                });
                this.router.navigate(['/boutique']);
                this.chargement = false;
            }
        });
    }

    prixOptionsUnitaire(): number {
        let total = this.badgesOfficiels ? this.prixBadgesOfficiels : 0;
        return total + this.prixFlocageTotal();
    }

    prixFlocageTotal(): number {
        if (!this.flocage) return 0;
        const nom = (this.flocageNom || '').trim();
        const numero = (this.flocageNumero || '').trim();
        return (nom.length + numero.length) * this.prixFlocageParLettre;
    }

    prixTotal(): number {
        if (!this.produit) return 0;
        return (this.produit.prix + this.prixOptionsUnitaire()) * this.quantite;
    }

    stockLabel(): string {
        if (!this.produit) return '';
        if (!this.produit.enStock || this.produit.stockTotal <= 0) return 'Rupture';
        if (this.produit.stockTotal < 8) return `Stock faible`;
        return 'En stock';
    }

    labelCategorie(categorie: string): string {
        const map: Record<string, string> = {
            'actuel': 'MAILLOT ACTUEL',
            'vintage-court': 'VINTAGE COURT',
            'vintage-long': 'VINTAGE LONG',
            'collection': 'COLLECTION'
        };
        return map[categorie] ?? 'ÉDITION SPÉCIALE';
    }

    ajouterAuPanier(allerPanier = false): void {
        if (!this.produit || !this.tailleSelectionnee || !this.couleurSelectionnee) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Sélection incomplète',
                detail: 'Veuillez choisir une taille et une couleur.'
            });
            return;
        }

        if (this.flocage && !this.flocageNom.trim() && !this.flocageNumero.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Flocage manquant',
                detail: 'Veuillez saisir un nom ou un numéro de flocage.'
            });
            return;
        }

        const options: OptionsMaillot = {
            taille: this.tailleSelectionnee,
            couleur: this.couleurSelectionnee,
            badgesOfficiels: this.badgesOfficiels,
            flocage: this.flocage,
            flocageNom: this.flocage ? this.flocageNom : undefined,
            flocageNumero: this.flocage ? this.flocageNumero : undefined,
            flocageTexte: this.flocage
                ? [this.flocageNom, this.flocageNumero].filter(v => v?.trim()).join(' ')
                : undefined
        };

        this.panierService.ajouterAuPanier(this.produit, options, this.quantite, this.prixOptionsUnitaire());

        this.messageService.add({
            severity: 'success',
            summary: 'Ajouté au panier',
            detail: 'Votre maillot a été ajouté avec vos options.'
        });

        if (allerPanier) this.allerAuPanier();
    }

    retourBoutique(): void {
        this.router.navigate(['/boutique']);
    }

    allerAuPanier(): void {
        this.router.navigate(['/boutique/panier']);
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement | null;
        if (img && !img.src.includes(this.fallbackImage)) {
            img.src = this.fallbackImage;
        }
    }

    formatPrix(prix: number): string {
        return new Intl.NumberFormat('fr-FR').format(prix);
    }
}
