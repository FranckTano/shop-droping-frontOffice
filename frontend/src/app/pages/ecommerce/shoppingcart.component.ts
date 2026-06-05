import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PanierService, ArticlePanier } from '@services/panier.service';
import { WhatsappService } from '@services/whatsapp.service';
import { CommandeService } from '@services/commande.service';
import { ProduitService } from '@services/produit.service';
import { AdresseMapComponent, AdresseInfo } from './adresse-map.component';

interface InfosClient {
    nom: string;
    indicatif: string;
    telephone: string;
    adresse: string;
    lienGps: string;
    notes: string;
    numeroWhatsappConfirme: boolean;
}

interface Pays {
    code: string;
    nom: string;
    indicatif: string;
    longueurMin: number;
    longueurMax: number;
}

@Component({
    selector: 'app-shopping-cart',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ButtonModule, RippleModule, DividerModule,
        ConfirmDialogModule, DialogModule, InputTextModule, TextareaModule,
        CheckboxModule, MultiSelectModule, ToastModule, AdresseMapComponent,
        SelectModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <p-toast></p-toast>
        <p-confirmDialog styleClass="sc-confirm-dialog"></p-confirmDialog>

        <div class="sc-shell">
            <!-- PAGE HEADER -->
            <div class="sc-page-header">
                <div class="sc-container">
                    <div class="sc-page-header__inner">
                        <div>
                            <span class="sc-page-header__kicker">VOTRE SÉLECTION</span>
                            <h1 class="sc-page-header__title">Panier</h1>
                            <p class="sc-page-header__count" *ngIf="!panierService.estVide()">
                                {{ panierService.nombreArticles() }} article(s) · {{ formatPrix(panierService.montantTotal()) }} FCFA
                            </p>
                        </div>
                        <button class="sc-back-btn" (click)="continuerAchats()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                            Continuer mes achats
                        </button>
                    </div>
                </div>
            </div>

            <div class="sc-container">

                <!-- EMPTY STATE -->
                <div *ngIf="panierService.estVide()" class="sc-empty">
                    <div class="sc-empty__icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                    </div>
                    <h2>Votre panier est vide</h2>
                    <p>"Built for champions." Ajoutez des maillots à votre sélection pour lancer votre commande.</p>
                    <button class="sc-btn sc-btn--primary sc-btn--lg" (click)="continuerAchats()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                        Explorer la boutique
                    </button>
                </div>

                <!-- CART LAYOUT -->
                <div *ngIf="!panierService.estVide()" class="sc-layout">

                    <!-- LEFT: ITEMS -->
                    <div class="sc-items">
                        <div *ngFor="let article of panierService.articles(); let i = index; trackBy: trackByArticleId"
                             class="sc-item"
                             [class.sc-item--bordered]="i > 0">

                            <div class="sc-item__img-wrap">
                                <img *ngIf="article.produit.imageUrl"
                                     [src]="produitImage(article.produit.imageUrl)"
                                     [alt]="article.produit.nom"
                                     class="sc-item__img" />
                                <div *ngIf="!article.produit.imageUrl" class="sc-item__img-placeholder">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                </div>
                            </div>

                            <div class="sc-item__content">
                                <div class="sc-item__header">
                                    <div class="sc-item__name-group">
                                        <h3 class="sc-item__name">{{ article.produit.nom }}</h3>
                                        <span class="sc-item__cat">{{ article.produit.categorie }}</span>
                                    </div>
                                    <div class="sc-item__unit-price">{{ formatPrix(prixUnitaire(article)) }} FCFA</div>
                                </div>

                                <div class="sc-item__tags">
                                    <span class="sc-tag">{{ article.options.taille }}</span>
                                    <span class="sc-tag">{{ article.options.couleur }}</span>
                                    <span class="sc-tag sc-tag--special" *ngIf="article.options.badgesOfficiels">Badges officiels</span>
                                    <span class="sc-tag sc-tag--special" *ngIf="article.options.flocage">
                                        Flocage{{ article.options.flocageTexte ? ': ' + article.options.flocageTexte : '' }}
                                    </span>
                                </div>

                                <!-- OPTIONS EDITOR -->
                                <div class="sc-options">
                                    <div class="sc-options__header" (click)="toggleOptions(article.id)">
                                        <span>Modifier les options</span>
                                        <svg [class.rotated]="optionsOuverts.has(article.id)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                                    </div>
                                    <div class="sc-options__body" [class.sc-options__body--open]="optionsOuverts.has(article.id)">
                                        <div class="sc-opt-row sc-opt-row--size">
                                            <label class="sc-opt-label">Taille</label>
                                            <p-multiSelect
                                                [ngModel]="taillesSelectionnees(article)"
                                                [options]="taillesOptions(article)"
                                                optionLabel="label"
                                                optionValue="value"
                                                [showToggleAll]="false"
                                                [maxSelectedLabels]="3"
                                                defaultLabel="Sélectionner une taille"
                                                selectedItemsLabel="Tailles sélectionnées"
                                                appendTo="body"
                                                styleClass="sc-multiselect"
                                                (ngModelChange)="changerTaille(article, $event)">
                                            </p-multiSelect>
                                        </div>

                                        <label class="sc-opt-check">
                                            <p-checkbox [binary]="true" [ngModel]="article.options.badgesOfficiels"
                                                        (ngModelChange)="changerBadge(article, $event)"></p-checkbox>
                                            <span>Badges officiels <em>(+500 FCFA)</em></span>
                                        </label>

                                        <label class="sc-opt-check">
                                            <p-checkbox [binary]="true" [ngModel]="article.options.flocage"
                                                        (ngModelChange)="changerFlocage(article, $event)"></p-checkbox>
                                            <span>Flocage personnalisé <em>(+500 FCFA/lettre)</em></span>
                                        </label>

                                        <div *ngIf="article.options.flocage" class="sc-flocage-inputs">
                                            <input pInputText #fNomInput
                                                   [value]="article.options.flocageNom || ''"
                                                   (blur)="changerFlocageNom(article, fNomInput.value)"
                                                   placeholder="Nom flocage"
                                                   class="sc-flocage-input" />
                                            <input pInputText #fNumInput
                                                   [value]="article.options.flocageNumero || ''"
                                                   (blur)="changerFlocageNumero(article, fNumInput.value)"
                                                   placeholder="Numéro flocage"
                                                   class="sc-flocage-input" />
                                        </div>
                                    </div>
                                </div>

                                <!-- BOTTOM ROW -->
                                <div class="sc-item__footer">
                                    <div class="sc-qty">
                                        <button class="sc-qty-btn" [disabled]="article.quantite <= 1"
                                                (click)="modifierQuantite(article, article.quantite - 1)">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                        </button>
                                        <span class="sc-qty-val">{{ article.quantite }}</span>
                                        <button class="sc-qty-btn" (click)="modifierQuantite(article, article.quantite + 1)">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                        </button>
                                    </div>

                                    <div class="sc-item__total-row">
                                        <strong class="sc-item__total">{{ formatPrix(prixUnitaire(article) * article.quantite) }} FCFA</strong>
                                        <button class="sc-del-btn" title="Retirer" (click)="confirmerSuppression(article)">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Clear cart -->
                        <div class="sc-items__footer">
                            <button class="sc-btn sc-btn--danger-ghost" (click)="confirmerViderPanier()">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                                Vider le panier
                            </button>
                        </div>
                    </div>

                    <!-- RIGHT: SUMMARY -->
                    <aside class="sc-summary">
                        <h3 class="sc-summary__title">Récapitulatif</h3>

                        <div class="sc-summary__lines">
                            <div class="sc-summary__line" *ngFor="let article of panierService.articles()">
                                <span class="sc-summary__item-name">{{ article.produit.nom }} ×{{ article.quantite }}</span>
                                <span>{{ formatPrix(prixUnitaire(article) * article.quantite) }}</span>
                            </div>
                        </div>

                        <div class="sc-summary__divider"></div>

                        <div class="sc-summary__row">
                            <span>Sous-total</span>
                            <span>{{ formatPrix(panierService.montantTotal()) }} FCFA</span>
                        </div>
                        <div class="sc-summary__row sc-summary__row--muted">
                            <span>Livraison</span>
                            <span>À confirmer</span>
                        </div>

                        <div class="sc-summary__divider"></div>

                        <div class="sc-summary__total">
                            <span>Total</span>
                            <strong>{{ formatPrix(panierService.montantTotal()) }} FCFA</strong>
                        </div>

                        <button class="sc-btn sc-btn--whatsapp sc-btn--lg sc-btn--full" (click)="ouvrirDialogCommande()">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                            Commander via WhatsApp
                        </button>

                        <div class="sc-summary__trust">
                            <div class="sc-trust-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00C851" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                <span>Paiement sécurisé à la livraison</span>
                            </div>
                            <div class="sc-trust-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF4500" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                <span>Préparation sous 24h</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>

        <!-- ==================== DIALOG COMMANDE ==================== -->
        <p-dialog
            header=" "
            [(visible)]="dialogCommandeVisible"
            [modal]="true"
            [style]="{width: 'min(96vw, 680px)'}"
            [draggable]="false"
            [resizable]="false"
            styleClass="sc-order-dialog">

            <ng-template pTemplate="header">
                <div class="sc-dialog__header">
                    <div class="sc-dialog__header-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                    </div>
                    <div>
                        <h3 class="sc-dialog__title">Finaliser votre commande</h3>
                        <p class="sc-dialog__subtitle">Renseignez vos coordonnées pour confirmer</p>
                    </div>
                </div>
            </ng-template>

            <div class="sc-dialog__body">
                <div class="sc-field">
                    <label class="sc-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Nom complet *
                    </label>
                    <input pInputText [(ngModel)]="infosClient.nom" placeholder="Votre nom et prénom" class="sc-input" />
                </div>

                <div class="sc-field">
                    <label class="sc-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .99h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.1a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v3z"/></svg>
                        Numéro WhatsApp *
                    </label>
                    <div class="sc-phone-row">
                        <p-select
                            [options]="paysList"
                            [(ngModel)]="paysSelectionne"
                            optionLabel="label"
                            [filter]="true"
                            filterBy="nom,indicatif"
                            appendTo="body"
                            styleClass="sc-pays-select"
                            placeholder="Pays">
                            <ng-template pTemplate="selectedItem" let-p>
                                <span class="sc-pays-option">{{ p?.drapeau }} {{ p?.indicatif }}</span>
                            </ng-template>
                            <ng-template pTemplate="item" let-p>
                                <span class="sc-pays-option">{{ p?.drapeau }} {{ p?.nom }} ({{ p?.indicatif }})</span>
                            </ng-template>
                        </p-select>
                        <input pInputText
                               [(ngModel)]="infosClient.telephone"
                               (ngModelChange)="onTelephoneChange()"
                               type="tel"
                               inputmode="numeric"
                               pattern="[0-9]*"
                               placeholder="Ex: 0796000000"
                               class="sc-input sc-phone-input"
                               [class.sc-input--error]="telephoneErreur"
                               maxlength="15" />
                    </div>
                    <small class="sc-phone-error" *ngIf="telephoneErreur">{{ telephoneErreur }}</small>
                    <small class="sc-phone-hint" *ngIf="!telephoneErreur && infosClient.telephone">
                        Numéro complet : <strong>{{ numeroComplet }}</strong>
                    </small>
                </div>

                <!-- Confirmation WhatsApp -->
                <div class="sc-field sc-whatsapp-confirm" *ngIf="infosClient.telephone && !telephoneErreur">
                    <label class="sc-opt-check sc-wa-check">
                        <p-checkbox [binary]="true" [(ngModel)]="infosClient.numeroWhatsappConfirme"></p-checkbox>
                        <span>
                            Je confirme que <strong>{{ numeroComplet }}</strong> est actif sur
                            <strong style="color:#25D366">WhatsApp</strong> ou <strong style="color:#25D366">WhatsApp Business</strong>
                        </span>
                    </label>
                    <small class="sc-wa-warning" *ngIf="infosClient.telephone && !infosClient.numeroWhatsappConfirme">
                        ⚠️ Votre commande sera annulée si ce numéro n'est pas joignable sur WhatsApp.
                    </small>
                </div>

                <div class="sc-field">
                    <label class="sc-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        Adresse de livraison *
                    </label>
                    <app-adresse-map
                        [active]="dialogCommandeVisible"
                        (adresseChoisie)="onAdresseChoisie($event)">
                    </app-adresse-map>
                    <input pInputText [(ngModel)]="infosClient.adresse" placeholder="Adresse auto-remplie ou saisir manuellement" class="sc-input" style="margin-top: 0.5rem;" />
                </div>

                <div class="sc-field">
                    <label class="sc-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        Notes (optionnel)
                    </label>
                    <textarea pTextarea [(ngModel)]="infosClient.notes" rows="3" placeholder="Instructions de livraison, préférences..." class="sc-textarea"></textarea>
                </div>

                <!-- Order preview -->
                <div class="sc-order-preview">
                    <div class="sc-order-preview__title">Récapitulatif de commande</div>
                    <div class="sc-order-preview__line" *ngFor="let article of panierService.articles()">
                        <span>{{ article.produit.nom }} ×{{ article.quantite }}</span>
                        <span>{{ formatPrix(prixUnitaire(article) * article.quantite) }} FCFA</span>
                    </div>
                    <div class="sc-order-preview__total">
                        <span>Total</span>
                        <strong>{{ formatPrix(panierService.montantTotal()) }} FCFA</strong>
                    </div>
                </div>
            </div>

            <ng-template pTemplate="footer">
                <div class="sc-dialog__footer">
                    <button class="sc-btn sc-btn--ghost" (click)="dialogCommandeVisible = false">Annuler</button>
                    @if (modePaiement === 'mobilemoney') {
                        <button class="sc-btn sc-btn--mobilemoney sc-btn--lg"
                                [disabled]="!formulaireValide"
                                [class.sc-btn--disabled]="!formulaireValide"
                                (click)="envoyerCommande()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                            Confirmer &amp; Voir instructions de paiement
                        </button>
                    } @else {
                        <button class="sc-btn sc-btn--whatsapp sc-btn--lg"
                                [disabled]="!formulaireValide"
                                [class.sc-btn--disabled]="!formulaireValide"
                                (click)="envoyerCommande()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                            Envoyer sur WhatsApp
                        </button>
                    }
                </div>
            </ng-template>
        </p-dialog>
    `,
    styles: [`
        :host {
            display: block;
            background: #faf7f2;
            color: #1a1a1a;
            font-family: 'Poppins', 'Segoe UI', sans-serif;
            min-height: 100vh;
        }

        .sc-shell {
            padding-bottom: 5rem;
        }

        .sc-container {
            max-width: 1320px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }

        /* ===== BUTTONS ===== */
        .sc-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.7rem 1.4rem;
            border-radius: 0.6rem;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            border: none;
            font-family: 'Poppins', sans-serif;
            transition: all 0.2s ease;
        }

        .sc-btn--primary {
            background: #FF4500;
            color: #ffffff;
            box-shadow: 0 4px 20px rgba(255, 69, 0, 0.3);
        }

        .sc-btn--primary:hover {
            background: #e03d00;
            transform: translateY(-2px);
        }

        .sc-btn--whatsapp {
            background: rgba(37, 211, 102, 0.12);
            color: #25D366;
            border: 1px solid rgba(37, 211, 102, 0.3);
        }

        .sc-btn--mobilemoney {
            background: linear-gradient(135deg, #1565C0 0%, #1976D2 100%);
            color: #fff;
            border: none;
            font-weight: 700;
        }

        .sc-btn--mobilemoney:hover:not(:disabled) {
            background: linear-gradient(135deg, #0d47a1 0%, #1565C0 100%);
            transform: translateY(-2px);
        }

        .sc-btn--mobilemoney:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .sc-spinner { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .sc-ou-separator {
            display: flex; align-items: center; gap: 0.75rem;
            color: #aaa; font-size: 0.78rem;
            margin: 0.15rem 0;
        }
        .sc-ou-separator::before, .sc-ou-separator::after {
            content: ''; flex: 1; height: 1px; background: #ede8e0;
        }

        .sc-btn--whatsapp:hover:not(.sc-btn--disabled) {
            background: rgba(37, 211, 102, 0.2);
            border-color: rgba(37, 211, 102, 0.5);
        }

        .sc-btn--ghost {
            background: #f5f0e6;
            color: #555555;
            border: 1px solid #ddd8d0;
        }

        .sc-btn--ghost:hover {
            background: #ede8e0;
            color: #1a1a1a;
        }

        .sc-btn--danger-ghost {
            background: transparent;
            color: rgba(255, 80, 80, 0.7);
            border: 1px solid rgba(255, 80, 80, 0.2);
        }

        .sc-btn--danger-ghost:hover {
            color: #ff5050;
            border-color: rgba(255, 80, 80, 0.4);
            background: rgba(255, 80, 80, 0.05);
        }

        .sc-btn--lg { padding: 0.85rem 1.8rem; font-size: 0.9rem; }
        .sc-btn--full { width: 100%; }
        .sc-btn--disabled { opacity: 0.4; cursor: not-allowed; }

        /* ===== PAGE HEADER FOOTBALL ===== */
        .sc-page-header {
            position: relative;
            overflow: hidden;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a0800 35%, #0d1500 65%, #080c0a 100%);
            margin-bottom: 2.5rem;
        }

        .sc-page-header::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 60px 60px;
            z-index: 0;
        }

        .sc-page-header::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse 60% 100% at 15% 50%, rgba(255, 69, 0, 0.12) 0%, transparent 65%);
            z-index: 0;
        }

        .sc-page-header__inner {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            flex-wrap: wrap;
            padding: 3rem 1.5rem 2.5rem;
            max-width: 1320px;
            margin: 0 auto;
        }

        .sc-page-header__kicker {
            display: block;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.2em;
            color: #FF6B35;
            margin-bottom: 0.3rem;
        }

        .sc-page-header__title {
            font-size: clamp(1.8rem, 4vw, 3rem);
            font-weight: 900;
            margin: 0 0 0.2rem;
            letter-spacing: -0.02em;
            color: #ffffff;
            text-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }

        .sc-page-header__count {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.5);
            margin: 0;
        }

        .sc-back-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.55rem 1.1rem;
            background: rgba(255, 255, 255, 0.07);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 0.5rem;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.8rem;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: all 0.2s ease;
        }

        .sc-back-btn:hover {
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.3);
            background: rgba(255, 255, 255, 0.12);
        }

        /* ===== EMPTY ===== */
        .sc-empty {
            text-align: center;
            padding: 6rem 2rem;
            border: 1.5px dashed #ddd8d0;
            border-radius: 1.5rem;
            background: #ffffff;
        }

        .sc-empty__icon { margin-bottom: 1.5rem; }

        .sc-empty h2 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #333333;
            margin: 0 0 0.75rem;
        }

        .sc-empty p {
            color: #888888;
            max-width: 44ch;
            margin: 0 auto 2rem;
            font-style: italic;
        }

        /* ===== LAYOUT ===== */
        .sc-layout {
            display: grid;
            grid-template-columns: 1fr 340px;
            gap: 1.5rem;
            align-items: start;
        }

        /* ===== ITEMS ===== */
        .sc-items {
            background: #ffffff;
            border: 1px solid #ede8e0;
            border-radius: 1.2rem;
            overflow: hidden;
            box-shadow: 0 2px 16px rgba(0,0,0,0.06);
        }

        .sc-item {
            display: grid;
            grid-template-columns: 110px 1fr;
            gap: 1rem;
            padding: 1.2rem;
        }

        .sc-item--bordered {
            border-top: 1px solid #ede8e0;
        }

        .sc-item__img-wrap {
            width: 110px;
            height: 130px;
            border-radius: 0.75rem;
            overflow: hidden;
            background: #f5f0e6;
            border: 1px solid #ede8e0;
            flex-shrink: 0;
        }

        .sc-item__img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .sc-item__img-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .sc-item__header {
            display: flex;
            justify-content: space-between;
            gap: 0.75rem;
            margin-bottom: 0.5rem;
        }

        .sc-item__name {
            margin: 0 0 0.2rem;
            font-size: 0.95rem;
            font-weight: 700;
            color: #1a1a1a;
        }

        .sc-item__cat {
            font-size: 0.72rem;
            color: #9e9490;
        }

        .sc-item__unit-price {
            font-size: 0.9rem;
            font-weight: 700;
            color: #FF4500;
            white-space: nowrap;
        }

        /* Tags */
        .sc-item__tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.3rem;
            margin-bottom: 0.75rem;
        }

        .sc-tag {
            padding: 0.2rem 0.55rem;
            background: #f5f0e6;
            border: 1px solid #ddd8d0;
            border-radius: 999px;
            font-size: 0.68rem;
            color: #6b6460;
        }

        .sc-tag--special {
            background: rgba(255, 69, 0, 0.1);
            border-color: rgba(255, 69, 0, 0.25);
            color: rgba(255, 120, 50, 0.9);
        }

        /* Options editor */
        .sc-options {
            margin-bottom: 0.75rem;
            border: 1px solid #ede8e0;
            border-radius: 0.6rem;
            overflow: hidden;
        }

        .sc-options__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.55rem 0.75rem;
            background: #faf7f2;
            cursor: pointer;
            font-size: 0.78rem;
            color: #888;
            transition: background 0.2s ease;
        }

        .sc-options__header:hover {
            background: #f5f0e6;
            color: #555;
        }

        .sc-options__header svg {
            transition: transform 0.25s ease;
        }

        .sc-options__header svg.rotated {
            transform: rotate(180deg);
        }

        .sc-options__body {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            padding: 0 0.75rem;
        }

        .sc-options__body--open {
            max-height: 400px;
            padding: 0.75rem;
        }

        .sc-opt-row--size {
            margin-bottom: 0.6rem;
        }

        .sc-opt-label {
            display: block;
            font-size: 0.73rem;
            color: #9e9490;
            margin-bottom: 0.3rem;
        }

        .sc-opt-check {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.35rem 0;
            font-size: 0.82rem;
            color: #555555;
            cursor: pointer;
        }

        .sc-opt-check em {
            font-style: normal;
            color: #9e9490;
            font-size: 0.75rem;
        }

        /* ── PrimeNG Checkbox override : affichage correct de l'état checked ── */
        ::ng-deep .sc-options .p-checkbox .p-checkbox-box {
            width: 18px;
            height: 18px;
            border: 2px solid #d1d5db;
            border-radius: 4px;
            background: #ffffff;
            transition: all 0.18s ease;
        }
        ::ng-deep .sc-options .p-checkbox .p-checkbox-box:hover {
            border-color: #FF4500;
        }
        ::ng-deep .sc-options .p-checkbox.p-highlight .p-checkbox-box,
        ::ng-deep .sc-options .p-checkbox .p-checkbox-box.p-highlight {
            background: #FF4500 !important;
            border-color: #FF4500 !important;
        }
        ::ng-deep .sc-options .p-checkbox.p-highlight .p-checkbox-box .p-checkbox-icon,
        ::ng-deep .sc-options .p-checkbox .p-checkbox-box.p-highlight .p-checkbox-icon {
            color: #ffffff !important;
            font-size: 11px;
        }
        ::ng-deep .sc-options .p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
            outline: 2px solid rgba(255, 69, 0, 0.35);
            outline-offset: 2px;
        }

        .sc-flocage-inputs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.4rem;
            margin-top: 0.4rem;
        }

        .sc-flocage-input {
            width: 100%;
            padding: 0.45rem 0.65rem;
            background: #ffffff !important;
            border: 1px solid #ddd8d0 !important;
            border-radius: 0.4rem !important;
            color: #1a1a1a !important;
            font-size: 0.8rem;
            font-family: 'Poppins', sans-serif;
        }

        /* Footer row */
        .sc-item__footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
        }

        .sc-qty {
            display: flex;
            align-items: center;
            gap: 0;
            background: #f5f0e6;
            border: 1px solid #ddd8d0;
            border-radius: 0.5rem;
            overflow: hidden;
        }

        .sc-qty-btn {
            width: 32px;
            height: 32px;
            background: transparent;
            border: none;
            color: #666666;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .sc-qty-btn:hover:not(:disabled) {
            background: #ede8e0;
            color: #1a1a1a;
        }

        .sc-qty-btn:disabled { opacity: 0.3; cursor: default; }

        .sc-qty-val {
            min-width: 36px;
            text-align: center;
            font-size: 0.9rem;
            font-weight: 700;
            color: #1a1a1a;
            border-left: 1px solid #ddd8d0;
            border-right: 1px solid #ddd8d0;
            line-height: 32px;
        }

        .sc-item__total-row {
            display: flex;
            align-items: center;
            gap: 0.6rem;
        }

        .sc-item__total {
            font-size: 1rem;
            font-weight: 700;
            color: #1a1a1a;
        }

        .sc-del-btn {
            width: 32px;
            height: 32px;
            border-radius: 0.4rem;
            background: rgba(255, 80, 80, 0.08);
            border: 1px solid rgba(255, 80, 80, 0.15);
            color: rgba(255, 100, 100, 0.7);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .sc-del-btn:hover {
            background: rgba(255, 80, 80, 0.15);
            border-color: rgba(255, 80, 80, 0.35);
            color: #ff5050;
        }

        .sc-items__footer {
            padding: 1rem 1.2rem;
            border-top: 1px solid #ede8e0;
            display: flex;
            justify-content: flex-end;
        }

        /* ===== SUMMARY ===== */
        .sc-summary {
            background: #ffffff;
            border: 1px solid #ede8e0;
            border-radius: 1.2rem;
            padding: 1.5rem;
            position: sticky;
            top: calc(72px + 1rem);
            box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }

        .sc-summary__title {
            font-size: 1.1rem;
            font-weight: 700;
            margin: 0 0 1.2rem;
            color: #1a1a1a;
        }

        .sc-summary__lines {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            margin-bottom: 1rem;
        }

        .sc-summary__line {
            display: flex;
            justify-content: space-between;
            gap: 0.5rem;
            font-size: 0.78rem;
            color: #9e9490;
        }

        .sc-summary__item-name {
            max-width: 60%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .sc-summary__divider {
            height: 1px;
            background: #ede8e0;
            margin: 0.75rem 0;
        }

        .sc-summary__row {
            display: flex;
            justify-content: space-between;
            font-size: 0.87rem;
            color: #555555;
            margin-bottom: 0.5rem;
        }

        .sc-summary__row--muted {
            color: #9e9490;
            font-size: 0.8rem;
        }

        .sc-summary__total {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 1.2rem;
        }

        .sc-summary__total span {
            font-size: 1rem;
            font-weight: 600;
            color: #555555;
        }

        .sc-summary__total strong {
            font-size: 1.5rem;
            font-weight: 800;
            color: #1a1a1a;
        }

        .sc-summary__trust {
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .sc-trust-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.75rem;
            color: #9e9490;
        }

        /* ===== DIALOG ===== */
        ::ng-deep .sc-order-dialog .p-dialog {
            background: #ffffff !important;
            border: 1px solid #ede8e0 !important;
            border-radius: 1.2rem !important;
        }

        ::ng-deep .sc-order-dialog .p-dialog-header {
            background: transparent !important;
            border-bottom: 1px solid #ede8e0 !important;
            padding: 1.2rem 1.5rem !important;
        }

        ::ng-deep .sc-order-dialog .p-dialog-content {
            background: transparent !important;
            padding: 1.5rem !important;
        }

        ::ng-deep .sc-order-dialog .p-dialog-footer {
            background: transparent !important;
            border-top: 1px solid #ede8e0 !important;
            padding: 1rem 1.5rem !important;
        }

        .sc-dialog__header {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .sc-dialog__header-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(37, 211, 102, 0.1);
            border: 1px solid rgba(37, 211, 102, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .sc-dialog__title {
            font-size: 1.05rem;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 0.15rem;
        }

        .sc-dialog__subtitle {
            font-size: 0.8rem;
            color: #9e9490;
            margin: 0;
        }

        .sc-dialog__body {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
        }

        .sc-field {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
        }

        .sc-label {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.8rem;
            font-weight: 600;
            color: #555555;
            letter-spacing: 0.04em;
        }

        .sc-input {
            padding: 0.7rem 0.9rem !important;
            background: #ffffff !important;
            border: 1px solid #ddd8d0 !important;
            border-radius: 0.6rem !important;
            color: #1a1a1a !important;
            font-family: 'Poppins', sans-serif !important;
            font-size: 0.88rem !important;
            transition: border-color 0.2s ease;
            width: 100%;
        }

        ::ng-deep .sc-input.p-inputtext {
            background: #ffffff !important;
            border: 1px solid #ddd8d0 !important;
            color: #1a1a1a !important;
            border-radius: 0.6rem !important;
        }

        ::ng-deep .sc-input.p-inputtext:focus {
            border-color: rgba(255, 69, 0, 0.5) !important;
            box-shadow: none !important;
        }

        ::ng-deep .sc-input.p-inputtext::placeholder { color: #bbb5ad !important; }

        .sc-textarea {
            width: 100%;
            padding: 0.7rem 0.9rem;
            background: #ffffff;
            border: 1px solid #ddd8d0;
            border-radius: 0.6rem;
            color: #1a1a1a;
            font-family: 'Poppins', sans-serif;
            font-size: 0.88rem;
            resize: vertical;
            outline: none;
        }

        .sc-textarea:focus { border-color: rgba(255, 69, 0, 0.5); }
        .sc-textarea::placeholder { color: #bbb5ad; }

        /* Order preview */
        .sc-order-preview {
            background: #faf7f2;
            border: 1px solid #ede8e0;
            border-radius: 0.75rem;
            padding: 1rem;
        }

        .sc-order-preview__title {
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #9e9490;
            margin-bottom: 0.75rem;
        }

        .sc-order-preview__line {
            display: flex;
            justify-content: space-between;
            font-size: 0.82rem;
            color: #555555;
            padding: 0.25rem 0;
            border-bottom: 1px solid #ede8e0;
        }

        .sc-order-preview__total {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            padding-top: 0.6rem;
            margin-top: 0.25rem;
        }

        .sc-order-preview__total span { color: #555555; }
        .sc-order-preview__total strong { color: #FF4500; font-weight: 700; }

        .sc-dialog__footer {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
        }

        /* ===== CONFIRM DIALOG ===== */
        ::ng-deep .sc-confirm-dialog .p-confirmdialog {
            background: #ffffff !important;
            border: 1px solid #ede8e0 !important;
            border-radius: 1rem !important;
        }

        ::ng-deep .p-confirmdialog .p-dialog-header,
        ::ng-deep .p-confirmdialog .p-dialog-content,
        ::ng-deep .p-confirmdialog .p-dialog-footer {
            background: #ffffff !important;
            color: #1a1a1a !important;
        }

        /* Multiselect light overrides */
        ::ng-deep .sc-multiselect.p-multiselect {
            background: #ffffff !important;
            border: 1px solid #ddd8d0 !important;
            border-radius: 0.5rem !important;
        }

        ::ng-deep .sc-multiselect .p-multiselect-label {
            color: #555555 !important;
            font-size: 0.82rem;
        }

        /* ===== RESPONSIVE ===== */

        /* Tablette large (≤ 1024px) */
        @media (max-width: 1024px) {
            .sc-layout { grid-template-columns: 1fr; }
            .sc-summary { position: static; }
            .sc-page-header__inner { padding: 2.5rem 1.5rem 2rem; }
        }

        /* Tablette (≤ 768px) */
        @media (max-width: 768px) {
            .sc-item {
                grid-template-columns: 90px 1fr;
                gap: 0.75rem;
            }
            .sc-item__img-wrap { width: 90px; height: 110px; }
            .sc-item__name { font-size: 0.88rem; }
            .sc-page-header__inner { padding: 2rem 1.2rem 1.5rem; flex-direction: column; align-items: flex-start; }
            .sc-back-btn { align-self: flex-start; }
        }

        /* Mobile (≤ 640px) */
        @media (max-width: 640px) {
            .sc-item { grid-template-columns: 1fr; }
            .sc-item__img-wrap { width: 100%; height: 220px; }
            .sc-dialog__footer { flex-direction: column; }
            .sc-dialog__footer .sc-btn { width: 100%; }
            .sc-flocage-inputs { grid-template-columns: 1fr; }
            .sc-page-header__inner { padding: 1.5rem 1rem 1.2rem; }
        }

        /* ── Champ téléphone + indicatif ── */
        .sc-phone-row { display: flex; gap: 0.5rem; align-items: stretch; }
        .sc-phone-input { flex: 1; }
        .sc-input--error { border-color: #ef4444 !important; }
        .sc-phone-error { font-size: 0.75rem; color: #ef4444; margin-top: 0.2rem; display: block; }
        .sc-phone-hint  { font-size: 0.75rem; color: #6b7280; margin-top: 0.2rem; display: block; }
        .sc-pays-option { font-size: 0.85rem; }

        /* PrimeNG Select (indicatif) override */
        ::ng-deep .sc-pays-select.p-select { min-width: 110px; max-width: 120px; background: #fff !important; border: 1px solid #ddd8d0 !important; border-radius: 0.6rem !important; }
        ::ng-deep .sc-pays-select .p-select-label { font-size: 0.85rem !important; padding: 0.65rem 0.7rem !important; }

        /* Confirmation WhatsApp */
        .sc-whatsapp-confirm { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 0.6rem; padding: 0.75rem; }
        .sc-wa-check { font-size: 0.83rem; color: #166534; }
        .sc-wa-check strong { color: #15803d; }
        .sc-wa-warning { font-size: 0.75rem; color: #d97706; margin-top: 0.4rem; display: block; }

        /* PrimeNG Checkbox dans confirmation */
        ::ng-deep .sc-whatsapp-confirm .p-checkbox .p-checkbox-box { border-color: #16a34a; border-radius: 4px; }
        ::ng-deep .sc-whatsapp-confirm .p-checkbox.p-highlight .p-checkbox-box { background: #16a34a !important; border-color: #16a34a !important; }

        /* Petit mobile (≤ 480px) */
        @media (max-width: 480px) {
            .sc-shell { padding-bottom: 2rem; }
            .sc-items { padding: 0.75rem; }
            .sc-summary { padding: 1.2rem; }
            .sc-total-row { font-size: 0.9rem; }
            .sc-total-row strong { font-size: 1.3rem; }
        }
    `]
})
export class ShoppingCartComponent implements OnInit {
    private readonly taillesStandards = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
    private readonly taillesSelectionCache = new Map<string, { raw: string; values: string[] }>();

    public panierService = inject(PanierService);
    private whatsappService = inject(WhatsappService);
    private commandeService = inject(CommandeService);
    private produitService = inject(ProduitService);
    private router = inject(Router);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    modePaiement: 'whatsapp' | 'mobilemoney' = 'whatsapp';

    dialogCommandeVisible = false;
    optionsOuverts = new Set<string>();

    infosClient: InfosClient = {
        nom: '', indicatif: '+225', telephone: '',
        adresse: '', lienGps: '', notes: '',
        numeroWhatsappConfirme: false
    };

    // ── Téléphone / pays ──────────────────────────────────────────────────
    telephoneErreur = '';

    readonly paysList = [
        { code: 'CI', nom: 'Côte d\'Ivoire', indicatif: '+225', drapeau: '🇨🇮', longueurMin: 8, longueurMax: 10 },
        { code: 'SN', nom: 'Sénégal',        indicatif: '+221', drapeau: '🇸🇳', longueurMin: 9, longueurMax: 9  },
        { code: 'ML', nom: 'Mali',            indicatif: '+223', drapeau: '🇲🇱', longueurMin: 8, longueurMax: 8  },
        { code: 'BF', nom: 'Burkina Faso',    indicatif: '+226', drapeau: '🇧🇫', longueurMin: 8, longueurMax: 8  },
        { code: 'GN', nom: 'Guinée',          indicatif: '+224', drapeau: '🇬🇳', longueurMin: 9, longueurMax: 9  },
        { code: 'TG', nom: 'Togo',            indicatif: '+228', drapeau: '🇹🇬', longueurMin: 8, longueurMax: 8  },
        { code: 'BJ', nom: 'Bénin',           indicatif: '+229', drapeau: '🇧🇯', longueurMin: 8, longueurMax: 8  },
        { code: 'GH', nom: 'Ghana',           indicatif: '+233', drapeau: '🇬🇭', longueurMin: 9, longueurMax: 9  },
        { code: 'NG', nom: 'Nigeria',         indicatif: '+234', drapeau: '🇳🇬', longueurMin: 10, longueurMax: 10 },
        { code: 'CM', nom: 'Cameroun',        indicatif: '+237', drapeau: '🇨🇲', longueurMin: 9, longueurMax: 9  },
        { code: 'GA', nom: 'Gabon',           indicatif: '+241', drapeau: '🇬🇦', longueurMin: 7, longueurMax: 8  },
        { code: 'CG', nom: 'Congo',           indicatif: '+242', drapeau: '🇨🇬', longueurMin: 9, longueurMax: 9  },
        { code: 'CD', nom: 'RD Congo',        indicatif: '+243', drapeau: '🇨🇩', longueurMin: 9, longueurMax: 9  },
        { code: 'MR', nom: 'Mauritanie',      indicatif: '+222', drapeau: '🇲🇷', longueurMin: 8, longueurMax: 8  },
        { code: 'FR', nom: 'France',          indicatif: '+33',  drapeau: '🇫🇷', longueurMin: 9, longueurMax: 9  },
        { code: 'BE', nom: 'Belgique',        indicatif: '+32',  drapeau: '🇧🇪', longueurMin: 8, longueurMax: 9  },
        { code: 'MA', nom: 'Maroc',           indicatif: '+212', drapeau: '🇲🇦', longueurMin: 9, longueurMax: 9  },
        { code: 'DZ', nom: 'Algérie',         indicatif: '+213', drapeau: '🇩🇿', longueurMin: 9, longueurMax: 9  },
        { code: 'TN', nom: 'Tunisie',         indicatif: '+216', drapeau: '🇹🇳', longueurMin: 8, longueurMax: 8  },
        { code: 'US', nom: 'États-Unis',      indicatif: '+1',   drapeau: '🇺🇸', longueurMin: 10, longueurMax: 10 },
        { code: 'CA', nom: 'Canada',          indicatif: '+1',   drapeau: '🇨🇦', longueurMin: 10, longueurMax: 10 },
    ];

    paysSelectionne = this.paysList[0]; // Côte d'Ivoire par défaut

    get numeroComplet(): string {
        const digits = (this.infosClient.telephone ?? '').replace(/\D/g, '');
        if (!digits) return '';
        return `${this.paysSelectionne.indicatif}${digits}`;
    }

    get formulaireValide(): boolean {
        return !!(
            this.infosClient.nom?.trim() &&
            this.infosClient.telephone?.trim() &&
            !this.telephoneErreur &&
            this.infosClient.numeroWhatsappConfirme &&
            this.infosClient.adresse?.trim()
        );
    }

    onTelephoneChange(): void {
        const digits = (this.infosClient.telephone ?? '').replace(/\D/g, '');
        const pays = this.paysSelectionne;
        if (!digits) {
            this.telephoneErreur = '';
            return;
        }
        if (digits.length < pays.longueurMin) {
            this.telephoneErreur = `Numéro trop court — min ${pays.longueurMin} chiffres pour ${pays.nom}.`;
        } else if (digits.length > pays.longueurMax) {
            this.telephoneErreur = `Numéro trop long — max ${pays.longueurMax} chiffres pour ${pays.nom}.`;
        } else {
            this.telephoneErreur = '';
        }
        // Reset confirmation si numéro change
        this.infosClient.numeroWhatsappConfirme = false;
    }
    // ─────────────────────────────────────────────────────────────────────

    ngOnInit(): void {}

    continuerAchats(): void {
        this.router.navigate(['/boutique']);
    }

    toggleOptions(articleId: string): void {
        if (this.optionsOuverts.has(articleId)) {
            this.optionsOuverts.delete(articleId);
        } else {
            this.optionsOuverts.add(articleId);
        }
    }

    modifierQuantite(article: ArticlePanier, nouvelleQuantite: number): void {
        if (nouvelleQuantite > 0) {
            this.panierService.mettreAJourQuantite(article.id, nouvelleQuantite);
            const tailles = this.taillesSelectionnees(article);
            if (tailles.length > nouvelleQuantite) {
                this.changerTaille(article, tailles.slice(0, nouvelleQuantite));
            }
        }
    }

    confirmerSuppression(article: ArticlePanier): void {
        this.confirmationService.confirm({
            message: `Retirer "${article.produit.nom}" du panier ?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, retirer',
            rejectLabel: 'Annuler',
            accept: () => {
                this.panierService.retirerDuPanier(article.id);
                this.messageService.add({ severity: 'success', summary: 'Retiré', detail: 'Article retiré du panier' });
            }
        });
    }

    confirmerViderPanier(): void {
        this.confirmationService.confirm({
            message: 'Vider tout le panier ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, vider',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.panierService.viderPanier();
                this.messageService.add({ severity: 'success', summary: 'Panier vidé', detail: 'Tous les articles ont été retirés' });
            }
        });
    }

    ouvrirDialogCommande(mode: 'whatsapp' | 'mobilemoney' = 'whatsapp'): void {
        this.modePaiement = mode;
        this.dialogCommandeVisible = true;
    }


    onAdresseChoisie(info: AdresseInfo): void {
        this.infosClient.adresse = info.adresse;
        this.infosClient.lienGps = info.lienGps;
    }

    envoyerCommande(): void {
        const articles = this.panierService.articles();
        const montantTotal = this.panierService.montantTotal();

        // Ouvrir la fenêtre WhatsApp MAINTENANT (geste synchrone = jamais bloqué sur iOS Safari)
        // Sur mobile : window.location sera mis à jour vers le lien wa.me après la réponse API
        const waWindow = window.open('', '_blank');

        const commande = {
            clientNom: this.infosClient.nom,
            clientTelephone: this.numeroComplet,
            clientAdresse: this.infosClient.adresse,
            notes: this.infosClient.notes,
            lignes: articles.map((a) => ({
                produitId: a.produit.id,
                taille: a.options.taille,
                couleur: a.options.couleur,
                quantite: a.quantite,
                badgesOfficiels: a.options.badgesOfficiels,
                flocage: a.options.flocage,
                flocageNom: a.options.flocageNom || null,
                flocageNumero: a.options.flocageNumero || null,
                prixOptionsUnitaire: a.prixOptionsUnitaire
            }))
        };

        this.commandeService.creerCommande(commande).subscribe({
            next: (res) => {
                this.dialogCommandeVisible = false;
                this.panierService.viderPanier();

                if (this.modePaiement === 'mobilemoney') {
                    const message = this.whatsappService.creerMessageMobileMoney(
                        {
                            nomClient: this.infosClient.nom,
                            telephoneClient: this.infosClient.telephone,
                            adresseClient: this.infosClient.adresse,
                            note: this.infosClient.notes,
                            montantTotal,
                            articles: articles.map((a) => ({
                                produitId: a.produit.id,
                                produitNom: a.produit.nom,
                                quantite: a.quantite,
                                options: a.options
                            }))
                        },
                        res.id,
                        res.numero
                    );
                    const lien = this.whatsappService.construireLien(message);
                    if (waWindow) { waWindow.location.href = lien; } else { window.location.href = lien; }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Commande créée ✓',
                        detail: `N° ${res.numero} — Instructions de paiement envoyées sur WhatsApp.`,
                        life: 7000
                    });
                    setTimeout(() => {
                        this.router.navigate(['/boutique/ma-commande'], { queryParams: { numero: res.numero } });
                    }, 1500);
                } else {
                    const message = this.whatsappService.creerMessageCommande(
                        {
                            nomClient: this.infosClient.nom,
                            telephoneClient: this.infosClient.telephone,
                            adresseClient: this.infosClient.adresse,
                            lienGps: this.infosClient.lienGps,
                            note: this.infosClient.notes,
                            montantTotal,
                            articles: articles.map((a) => ({
                                produitId: a.produit.id,
                                produitNom: a.produit.nom,
                                imageUrl: this.produitService.resolveImageUrl(a.produit.imageUrl),
                                quantite: a.quantite,
                                options: a.options
                            }))
                        },
                        res.id,
                        res.numero
                    );
                    const lien = this.whatsappService.construireLien(message);
                    if (waWindow) { waWindow.location.href = lien; } else { window.location.href = lien; }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Commande envoyée ✓',
                        detail: `N° ${res.numero} — Gardez ce numéro pour suivre votre commande.`,
                        life: 7000
                    });
                    setTimeout(() => {
                        this.router.navigate(['/boutique/ma-commande'], { queryParams: { numero: res.numero } });
                    }, 1500);
                }
            },
            error: () => {
                if (waWindow) waWindow.close();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Une erreur est survenue. Veuillez réessayer.',
                    life: 5000
                });
            }
        });
    }

    formatPrix(prix: number): string {
        return new Intl.NumberFormat('fr-FR').format(prix);
    }

    trackByArticleId(_index: number, article: ArticlePanier): string {
        return article.id;
    }

    prixUnitaire(article: ArticlePanier): number {
        return article.produit.prix + article.prixOptionsUnitaire;
    }

    changerBadge(article: ArticlePanier, value: boolean): void {
        this.mettreAJourOptions(article, { ...article.options, badgesOfficiels: value });
    }

    changerTaille(article: ArticlePanier, taillesSelectionnees: string[] | null | undefined): void {
        const tailles = (taillesSelectionnees ?? []).map(t => (t ?? '').trim().toUpperCase()).filter(t => t.length > 0);
        let taillesFinales = tailles;
        if (article.quantite <= 1 && tailles.length > 0) taillesFinales = [tailles[tailles.length - 1]];
        else if (tailles.length > article.quantite) taillesFinales = tailles.slice(0, article.quantite);
        const tailleChoisie = taillesFinales.length > 0 ? taillesFinales.join(', ') : 'M';
        this.mettreAJourOptions(article, { ...article.options, taille: tailleChoisie });
        this.taillesSelectionCache.set(article.id, { raw: tailleChoisie, values: taillesFinales.length > 0 ? taillesFinales : ['M'] });
    }

    changerFlocage(article: ArticlePanier, value: boolean): void {
        this.mettreAJourOptions(article, {
            ...article.options, flocage: value,
            flocageNom: value ? (article.options.flocageNom ?? '') : '',
            flocageNumero: value ? (article.options.flocageNumero ?? '') : '',
            flocageTexte: value ? (article.options.flocageTexte ?? '') : ''
        });
    }

    changerFlocageNom(article: ArticlePanier, value: string): void {
        this.mettreAJourOptions(article, { ...article.options, flocageNom: value });
    }

    changerFlocageNumero(article: ArticlePanier, value: string): void {
        this.mettreAJourOptions(article, { ...article.options, flocageNumero: value });
    }

    private mettreAJourOptions(article: ArticlePanier, options: ArticlePanier['options']): void {
        const cleaned = {
            ...options,
            flocageNom: options.flocageNom?.trim() ?? '',
            flocageNumero: options.flocageNumero?.trim() ?? ''
        };
        cleaned.flocageTexte = cleaned.flocage
            ? [cleaned.flocageNom, cleaned.flocageNumero].filter(v => v?.length > 0).join(' ')
            : '';
        const prixOptions = this.calculerPrixOptions(cleaned);
        this.panierService.mettreAJourOptions(article.id, cleaned, prixOptions);
    }

    private calculerPrixOptions(options: ArticlePanier['options']): number {
        const prixBadge = options.badgesOfficiels ? 500 : 0;
        if (!options.flocage) return prixBadge;
        const longueur = `${options.flocageNom ?? ''}${options.flocageNumero ?? ''}`.trim().length;
        return prixBadge + (longueur * 500);
    }

    produitImage(imageUrl?: string): string {
        return this.produitService.resolveImageUrl(imageUrl);
    }

    taillesOptions(article: ArticlePanier): Array<{ label: string; value: string }> {
        const taillesProduit = Array.isArray(article.produit.taillesDisponibles) ? article.produit.taillesDisponibles : [];
        const tailles = Array.from(new Set([...this.taillesStandards, ...taillesProduit.map(t => (t ?? '').trim().toUpperCase())])).filter(t => t.length > 0);
        return tailles.map(t => ({ label: `Taille ${t}`, value: t }));
    }

    taillesSelectionnees(article: ArticlePanier): string[] {
        const raw = this.normaliserValeurTaille(article.options.taille);
        const cache = this.taillesSelectionCache.get(article.id);
        if (cache && cache.raw === raw) return cache.values;
        const tailles = raw.split(',').map(t => t.trim().toUpperCase()).filter(t => t.length > 0);
        const values = tailles.length > 0 ? tailles : ['M'];
        this.taillesSelectionCache.set(article.id, { raw, values });
        return values;
    }

    private normaliserValeurTaille(taille: unknown): string {
        if (Array.isArray(taille)) return taille.map(v => String(v ?? '').trim()).filter(v => v.length > 0).join(', ');
        return String(taille ?? '').trim();
    }
}
