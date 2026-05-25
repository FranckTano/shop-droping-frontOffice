import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProduitService, Produit } from '@services/produit.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { PanierService } from '@services/panier.service';

type OngletId = 'tous' | 'actuel' | 'vintage-court' | 'vintage-long' | 'collection';
type VueMode = 'grid-classic' | 'grid-premium' | 'masonry' | 'list' | 'mini' | 'showcase';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SkeletonModule, RippleModule,
              ToastModule, DialogModule, CarouselModule, PaginatorModule],
    providers: [MessageService],
    template: `
        <p-toast position="top-right"></p-toast>

        <!-- ==================== HERO ==================== -->
        <section class="pl-hero">
            <div class="pl-container pl-hero__content">
                <div class="pl-hero__text">
                    <span class="pl-hero__kicker">NOUVELLE COLLECTION 2025</span>
                    <h1 class="pl-hero__title">
                        Maillots<br>
                        <span class="pl-hero__title-accent">d'Exception</span>
                    </h1>
                    <p class="pl-hero__subtitle">
                        Trouvez votre style, personnalisez chaque détail et commandez en quelques clics. L'expérience football premium.
                    </p>
                    <div class="pl-hero__ctas">
                        <button class="pl-btn pl-btn--primary" (click)="changerOnglet('collection')">
                            Voir les best sellers
                        </button>
                        <button class="pl-btn pl-btn--outline" (click)="allerAuPanier()">
                            Mon panier
                        </button>
                    </div>
                    <div class="pl-hero__stats">
                        <div class="pl-hero__stat">
                            <strong>{{ statNbMaillots }}+</strong>
                            <span>Maillots en ligne</span>
                        </div>
                        <div class="pl-hero__stat-divider"></div>
                        <div class="pl-hero__stat">
                            <strong>100%</strong>
                            <span>Personnalisable</span>
                        </div>
                        <div class="pl-hero__stat-divider"></div>
                        <div class="pl-hero__stat">
                            <strong>24h</strong>
                            <span>Livraison rapide</span>
                        </div>
                    </div>
                </div>
                <div class="pl-hero__visual">
                    <div class="pl-hero__badge-stack">
                        <div class="pl-hero__badge-card pl-hero__badge-card--1">
                            <span class="pl-hero__badge-icon">⚽</span>
                            <span>Football Premium</span>
                        </div>
                        <div class="pl-hero__badge-card pl-hero__badge-card--2">
                            <span class="pl-hero__badge-icon">✦</span>
                            <span>Qualité garantie</span>
                        </div>
                        <div class="pl-hero__badge-card pl-hero__badge-card--3">
                            <span class="pl-hero__badge-icon">🏆</span>
                            <span>Clubs officiels</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ==================== CAROUSEL VEDETTES ==================== -->
        <section class="pl-featured" *ngIf="!chargement && produitsFeatured.length > 0">
            <div class="pl-container">
                <div class="pl-section-head">
                    <span class="pl-section-kicker">Sélection</span>
                    <h2 class="pl-section-title">En vedette</h2>
                    <p class="pl-section-sub">Les maillots les plus appréciés de notre boutique</p>
                </div>
                <p-carousel
                    [value]="produitsFeatured"
                    [numVisible]="4"
                    [numScroll]="1"
                    [circular]="true"
                    [autoplayInterval]="3500"
                    [responsiveOptions]="carouselOptions"
                    styleClass="pl-carousel">
                    <ng-template pTemplate="item" let-produit>
                        <div class="pl-fcard" (click)="ouvrirApercuProduit(produit)">
                            <div class="pl-fcard__img-wrap">
                                <span class="pl-fcard__badge">{{ labelCategorie(produit.categorie) }}</span>
                                <img
                                    [src]="produitService.resolveImageUrl(produit.imageUrl)"
                                    [alt]="produit.nom"
                                    class="pl-fcard__img"
                                    loading="lazy"
                                    (error)="onImageError($event)" />
                            </div>
                            <div class="pl-fcard__body">
                                <h4 class="pl-fcard__name">{{ produit.nom }}</h4>
                                <span class="pl-fcard__team">{{ produit.equipe }}</span>
                                <strong class="pl-fcard__price">{{ produit.prix | number:'1.0-0' }} FCFA</strong>
                            </div>
                        </div>
                    </ng-template>
                </p-carousel>
            </div>
        </section>

        <!-- ==================== CATEGORIES ==================== -->
        <section class="pl-categories" *ngIf="!chargement && produits.length">
            <div class="pl-container">
                <div class="pl-categories__grid">
                    <button
                        *ngFor="let onglet of onglets.slice(1)"
                        class="pl-cat-card"
                        [class.pl-cat-card--active]="onglet.id === ongletActif"
                        (click)="changerOnglet(onglet.id)">
                        <span class="pl-cat-card__icon">
                            <span *ngIf="onglet.id === 'actuel'">⚡</span>
                            <span *ngIf="onglet.id === 'vintage-court'">👕</span>
                            <span *ngIf="onglet.id === 'vintage-long'">🧥</span>
                            <span *ngIf="onglet.id === 'collection'">⭐</span>
                        </span>
                        <span class="pl-cat-card__label">{{ onglet.label }}</span>
                        <strong class="pl-cat-card__count">{{ countByTab(onglet.id) }}</strong>
                    </button>
                </div>
            </div>
        </section>

        <!-- ==================== TOOLBAR + SÉLECTEUR DE VUE ==================== -->
        <section class="pl-toolbar">
            <div class="pl-container pl-toolbar__inner">

                <div class="pl-toolbar__filters">
                    <button
                        *ngFor="let onglet of onglets"
                        class="pl-filter-btn"
                        [class.pl-filter-btn--active]="ongletActif === onglet.id"
                        (click)="changerOnglet(onglet.id)">
                        {{ onglet.label }}
                        <span class="pl-filter-btn__count" *ngIf="onglet.id !== 'tous'">({{ countByTab(onglet.id) }})</span>
                    </button>

                    <div class="pl-toolbar__page-size">
                        <span class="pl-toolbar__page-size-label">Par page</span>
                        <select
                            class="pl-toolbar__page-size-select"
                            [ngModel]="rowsPerPage"
                            (ngModelChange)="onRowsPerPageChange($event)">
                            <option *ngFor="let option of rowsPerPageOptions" [ngValue]="option">{{ option }}</option>
                        </select>
                    </div>
                </div>

                <div class="pl-toolbar__actions">
                    <!-- Barre de recherche -->
                    <div class="pl-search">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input
                            class="pl-search__input"
                            type="text"
                            [(ngModel)]="recherche"
                            (input)="filtrerProduits()"
                            placeholder="Rechercher un maillot..." />
                        <button *ngIf="recherche" class="pl-search__clear" (click)="recherche=''; filtrerProduits()">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>

                    <!-- Sélecteur de vue -->
                    <div class="pl-view-switcher" title="Mode d'affichage">
                        <button class="pl-view-btn" [class.pl-view-btn--active]="vueMode==='grid-classic'"
                                title="Grille classique" (click)="changerVue('grid-classic')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/>
                            </svg>
                        </button>
                        <button class="pl-view-btn" [class.pl-view-btn--active]="vueMode==='grid-premium'"
                                title="Grille premium" (click)="changerVue('grid-premium')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2 2h9v9H2zm11 0h9v9h-9zM2 13h9v9H2zm11 0h9v9h-9z"/>
                            </svg>
                        </button>
                        <button class="pl-view-btn" [class.pl-view-btn--active]="vueMode==='masonry'"
                                title="Masonry" (click)="changerVue('masonry')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 3h7v11H3zM14 3h7v7h-7zM3 16h7v5H3zM14 12h7v9h-7z"/>
                            </svg>
                        </button>
                        <button class="pl-view-btn" [class.pl-view-btn--active]="vueMode==='list'"
                                title="Vue liste" (click)="changerVue('list')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 5h4v4H3zm6 1h12v2H9zM3 13h4v4H3zm6 1h12v2H9z"/>
                            </svg>
                        </button>
                        <button class="pl-view-btn" [class.pl-view-btn--active]="vueMode==='mini'"
                                title="Miniatures" (click)="changerVue('mini')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2 2h5v5H2zm8 0h5v5h-5zm8 0h5v5h-5zM2 10h5v5H2zm8 0h5v5h-5zm8 0h5v5h-5zM2 18h5v5H2zm8 0h5v5h-5zm8 0h5v5h-5z"/>
                            </svg>
                        </button>
                        <button class="pl-view-btn" [class.pl-view-btn--active]="vueMode==='showcase'"
                                title="Grande vitrine" (click)="changerVue('showcase')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2 4h20v7H2zm0 9h20v7H2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- ==================== PRODUCT GRID ==================== -->
        <section class="pl-products">
            <div class="pl-container">

                <!-- Skeleton chargement -->
                <div *ngIf="chargement" class="pl-grid pl-grid--classic">
                    <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="pl-skeleton-card">
                        <p-skeleton height="260px" borderRadius="12px 12px 0 0"></p-skeleton>
                        <div class="pl-skeleton-card__body">
                            <p-skeleton width="65%" height="1rem" styleClass="mb-2"></p-skeleton>
                            <p-skeleton width="40%" height="0.75rem" styleClass="mb-3"></p-skeleton>
                            <p-skeleton width="45%" height="1.4rem"></p-skeleton>
                        </div>
                    </div>
                </div>

                <!-- ===== VUE : GRID CLASSIQUE ===== -->
                <div *ngIf="!chargement && produitsPagines.length > 0 && vueMode === 'grid-classic'"
                     class="pl-grid pl-grid--classic pl-grid--animated">
                    <article *ngFor="let produit of produitsPagines; let i = index"
                             class="pl-card"
                             [style.animation-delay]="(i * 0.05) + 's'"
                             (click)="ouvrirApercuProduit(produit)">
                        <div class="pl-card__img-wrap">
                            <span class="pl-card__badge">{{ labelCategorie(produit.categorie) }}</span>
                            <span class="pl-card__stock-badge" *ngIf="produit.stockTotal > 0 && produit.stockTotal < 8">
                                Derniers articles
                            </span>
                            <img [src]="produitService.resolveImageUrl(produit.imageUrl)"
                                 [alt]="produit.nom" class="pl-card__img" loading="lazy"
                                 (error)="onImageError($event)" />
                            <div class="pl-card__overlay">
                                <button class="pl-card__overlay-btn"
                                        (click)="$event.stopPropagation(); ouvrirApercuProduit(produit)">
                                    Aperçu rapide
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                </button>
                            </div>
                        </div>
                        <div class="pl-card__body">
                            <div>
                                <h3 class="pl-card__name">{{ produit.nom }}</h3>
                                <span class="pl-card__team">{{ produit.equipe }}</span>
                            </div>
                            <div class="pl-card__sur-commande">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                Sur commande · 2–5 j
                            </div>
                            <div class="pl-card__footer">
                                <div class="pl-card__price">
                                    <small>Prix TTC</small>
                                    <strong>{{ produit.prix | number:'1.0-0' }} <span>FCFA</span></strong>
                                </div>
                                <button class="pl-card__add-btn" title="Ajout rapide au panier"
                                        (click)="ajouterRapideAuPanier(produit, $event)">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                </button>
                            </div>
                        </div>
                    </article>
                    <!-- Cards décoratives pour combler les espaces -->
                    <div *ngFor="let d of cartesDecoratives; let j = index"
                         class="pl-deco-card" [class.pl-deco-card--alt]="j % 2 === 1">
                        <div class="pl-deco-card__inner">
                            <div class="pl-deco-card__ball">
                                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="2" stroke-opacity="0.4"/>
                                    <polygon points="50,18 62,38 38,38" stroke="currentColor" stroke-width="1.5" fill="none" stroke-opacity="0.5"/>
                                    <polygon points="50,82 38,62 62,62" stroke="currentColor" stroke-width="1.5" fill="none" stroke-opacity="0.5"/>
                                    <polygon points="18,50 38,38 38,62" stroke="currentColor" stroke-width="1.5" fill="none" stroke-opacity="0.5"/>
                                    <polygon points="82,50 62,62 62,38" stroke="currentColor" stroke-width="1.5" fill="none" stroke-opacity="0.5"/>
                                    <circle cx="50" cy="50" r="8" stroke="currentColor" stroke-width="1.5" fill="none" stroke-opacity="0.6"/>
                                </svg>
                            </div>
                            <p class="pl-deco-card__label">Bientôt disponible</p>
                            <span class="pl-deco-card__sub">Nouvelles arrivées</span>
                        </div>
                    </div>
                </div>

                <!-- ===== VUE : GRID PREMIUM ===== -->
                <div *ngIf="!chargement && produitsPagines.length > 0 && vueMode === 'grid-premium'"
                     class="pl-grid pl-grid--premium pl-grid--animated">
                    <article *ngFor="let produit of produitsPagines; let i = index"
                             class="pl-card pl-card--premium"
                             [style.animation-delay]="(i * 0.05) + 's'"
                             (click)="ouvrirApercuProduit(produit)">
                        <div class="pl-card__img-wrap">
                            <span class="pl-card__badge">{{ labelCategorie(produit.categorie) }}</span>
                            <img [src]="produitService.resolveImageUrl(produit.imageUrl)"
                                 [alt]="produit.nom" class="pl-card__img" loading="lazy"
                                 (error)="onImageError($event)" />
                            <!-- CTA centré visible au hover -->
                            <div class="pl-card__premium-hover">
                                <button class="pl-card__premium-cta"
                                        (click)="$event.stopPropagation(); ouvrirApercuProduit(produit)">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>
                                    Commander
                                </button>
                            </div>
                            <!-- Infos toujours visibles en bas de l'image -->
                            <div class="pl-card__premium-footer">
                                <div class="pl-card__premium-info">
                                    <h3 class="pl-card__premium-name">{{ produit.nom }}</h3>
                                    <span class="pl-card__premium-team">{{ produit.equipe }}</span>
                                </div>
                                <strong class="pl-card__premium-price">
                                    {{ produit.prix | number:'1.0-0' }}<small>FCFA</small>
                                </strong>
                            </div>
                        </div>
                    </article>
                </div>

                <!-- ===== VUE : MASONRY ===== -->
                <div *ngIf="!chargement && produitsPagines.length > 0 && vueMode === 'masonry'"
                     class="pl-masonry pl-grid--animated">
                    <article *ngFor="let produit of produitsPagines; let i = index"
                             class="pl-card pl-card--masonry"
                             [style.animation-delay]="(i * 0.04) + 's'"
                             (click)="ouvrirApercuProduit(produit)">
                        <div class="pl-card__img-wrap">
                            <span class="pl-card__badge">{{ labelCategorie(produit.categorie) }}</span>
                            <img [src]="produitService.resolveImageUrl(produit.imageUrl)"
                                 [alt]="produit.nom" class="pl-card__img" loading="lazy"
                                 (error)="onImageError($event)" />
                            <div class="pl-card__overlay">
                                <button class="pl-card__overlay-btn"
                                        (click)="$event.stopPropagation(); ouvrirApercuProduit(produit)">
                                    Aperçu rapide
                                </button>
                            </div>
                        </div>
                        <div class="pl-card__body">
                            <div>
                                <h3 class="pl-card__name">{{ produit.nom }}</h3>
                                <span class="pl-card__team">{{ produit.equipe }}</span>
                            </div>
                            <div class="pl-card__sur-commande">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                Sur commande · 2–5 j
                            </div>
                            <div class="pl-card__footer">
                                <div class="pl-card__price">
                                    <small>Prix TTC</small>
                                    <strong>{{ produit.prix | number:'1.0-0' }} <span>FCFA</span></strong>
                                </div>
                                <button class="pl-card__add-btn" title="Ajouter au panier"
                                        (click)="ajouterRapideAuPanier(produit, $event)">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                </button>
                            </div>
                        </div>
                    </article>
                </div>

                <!-- ===== VUE : LISTE ===== -->
                <div *ngIf="!chargement && produitsPagines.length > 0 && vueMode === 'list'"
                     class="pl-list pl-grid--animated">
                    <article *ngFor="let produit of produitsPagines; let i = index"
                             class="pl-list-item"
                             [style.animation-delay]="(i * 0.06) + 's'"
                             (click)="ouvrirApercuProduit(produit)">
                        <div class="pl-list-item__img-wrap">
                            <img [src]="produitService.resolveImageUrl(produit.imageUrl)"
                                 [alt]="produit.nom" class="pl-list-item__img" loading="lazy"
                                 (error)="onImageError($event)" />
                        </div>
                        <div class="pl-list-item__body">
                            <div class="pl-list-item__tags">
                                <span class="pl-card__badge" style="position:static; display:inline-block">{{ labelCategorie(produit.categorie) }}</span>
                                <span class="pl-card__stock-badge" style="position:static; display:inline-block"
                                      *ngIf="produit.stockTotal > 0 && produit.stockTotal < 8">Derniers articles</span>
                            </div>
                            <div>
                                <h3 class="pl-list-item__name">{{ produit.nom }}</h3>
                                <span class="pl-list-item__team">{{ produit.equipe }}</span>
                                <p class="pl-list-item__desc">{{ produit.description }}</p>
                            </div>
                            <div class="pl-list-item__bottom">
                                <div class="pl-card__price">
                                    <small>Prix TTC</small>
                                    <strong>{{ produit.prix | number:'1.0-0' }} <span>FCFA</span></strong>
                                </div>
                                <div class="pl-list-item__actions">
                                    <button class="pl-btn pl-btn--primary pl-btn--sm"
                                            (click)="$event.stopPropagation(); ouvrirApercuProduit(produit)">
                                        Aperçu rapide
                                    </button>
                                    <button class="pl-btn pl-btn--outline pl-btn--sm"
                                            (click)="$event.stopPropagation(); voirProduit(produit.id)">
                                        Personnaliser
                                    </button>
                                    <button class="pl-card__add-btn" title="Ajouter au panier"
                                            (click)="ajouterRapideAuPanier(produit, $event)">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>

                <!-- ===== VUE : MINI CARDS ===== -->
                <div *ngIf="!chargement && produitsPagines.length > 0 && vueMode === 'mini'"
                     class="pl-grid pl-grid--mini pl-grid--animated">
                    <article *ngFor="let produit of produitsPagines; let i = index"
                             class="pl-mini-card"
                             [style.animation-delay]="(i * 0.03) + 's'"
                             (click)="ouvrirApercuProduit(produit)">
                        <div class="pl-mini-card__img-wrap">
                            <span class="pl-mini-card__badge">{{ labelCategorie(produit.categorie) }}</span>
                            <img [src]="produitService.resolveImageUrl(produit.imageUrl)"
                                 [alt]="produit.nom" class="pl-mini-card__img" loading="lazy"
                                 (error)="onImageError($event)" />
                            <div class="pl-mini-card__overlay">
                                <button class="pl-mini-card__add-btn" title="Ajouter au panier"
                                        (click)="ajouterRapideAuPanier(produit, $event)">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                </button>
                            </div>
                        </div>
                        <div class="pl-mini-card__body">
                            <p class="pl-mini-card__name">{{ produit.nom }}</p>
                            <span class="pl-mini-card__price">{{ produit.prix | number:'1.0-0' }} FCFA</span>
                        </div>
                    </article>
                </div>

                <!-- ===== VUE : SHOWCASE (VITRINE) ===== -->
                <div *ngIf="!chargement && produitsPagines.length > 0 && vueMode === 'showcase'"
                     class="pl-showcase pl-grid--animated">
                    <article *ngFor="let produit of produitsPagines; let i = index"
                             class="pl-showcase-item"
                             [class.pl-showcase-item--reverse]="i % 2 === 1"
                             [style.animation-delay]="(i * 0.08) + 's'"
                             (click)="ouvrirApercuProduit(produit)">
                        <div class="pl-showcase-item__img-wrap">
                            <img [src]="produitService.resolveImageUrl(produit.imageUrl)"
                                 [alt]="produit.nom" class="pl-showcase-item__img" loading="lazy"
                                 (error)="onImageError($event)" />
                        </div>
                        <div class="pl-showcase-item__body">
                            <span class="pl-showcase-item__kicker">{{ labelCategorie(produit.categorie) }}</span>
                            <h3 class="pl-showcase-item__name">{{ produit.nom }}</h3>
                            <span class="pl-showcase-item__team">{{ produit.equipe }}</span>
                            <p class="pl-showcase-item__desc">{{ produit.description }}</p>
                            <div class="pl-showcase-item__price">
                                {{ produit.prix | number:'1.0-0' }} <span>FCFA</span>
                            </div>
                            <div class="pl-showcase-item__stock" *ngIf="produit.stockTotal > 0 && produit.stockTotal < 8">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e07c00" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Derniers articles disponibles
                            </div>
                            <div class="pl-showcase-item__actions">
                                <button class="pl-btn pl-btn--primary"
                                        (click)="$event.stopPropagation(); ouvrirApercuProduit(produit)">
                                    Aperçu rapide
                                </button>
                                <button class="pl-btn pl-btn--outline"
                                        (click)="$event.stopPropagation(); voirProduit(produit.id)">
                                    Personnaliser
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                                </button>
                            </div>
                        </div>
                    </article>
                </div>

                <!-- Empty State -->
                <div *ngIf="!chargement && produitsFiltres.length === 0" class="pl-empty">
                    <div class="pl-empty__icon">
                        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <h3>Aucun maillot trouvé</h3>
                    <p>Essayez un autre terme ou réinitialisez les filtres.</p>
                    <button class="pl-btn pl-btn--primary" (click)="reinitialiserFiltres()">Réinitialiser</button>
                </div>

                <!-- Paginator -->
                <div *ngIf="!chargement && produitsFiltres.length > rowsPerPage" class="pl-paginator-wrap">
                    <p-paginator
                        [rows]="rowsPerPage"
                        [totalRecords]="produitsFiltres.length"
                        (onPageChange)="onPageChange($event)"
                        styleClass="pl-paginator">
                    </p-paginator>
                </div>

            </div>
        </section>

        <!-- ==================== APERCU MODAL ==================== -->
        <p-dialog
            [(visible)]="apercuVisible"
            [modal]="true"
            [draggable]="false"
            [resizable]="false"
            [dismissableMask]="true"
            [style]="{ width: 'min(96vw, 820px)' }"
            styleClass="pl-dialog">
            <ng-template pTemplate="header">
                <div class="pl-dialog__header" *ngIf="produitSelectionne">
                    <span class="pl-dialog__badge">{{ labelCategorie(produitSelectionne.categorie) }}</span>
                    <span class="pl-dialog__title">{{ produitSelectionne.nom }}</span>
                </div>
            </ng-template>
            <ng-container *ngIf="produitSelectionne as produit">
                <div class="pl-dialog__body">
                    <div class="pl-dialog__img-wrap">
                        <img [src]="produitService.resolveImageUrl(produit.imageUrl)"
                             [alt]="produit.nom" class="pl-dialog__img"
                             (error)="onImageError($event)" />
                    </div>
                    <div class="pl-dialog__info">
                        <p class="pl-dialog__desc">{{ produit.description }}</p>
                        <div class="pl-dialog__meta">
                            <span class="pl-dialog__meta-item">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                                {{ produit.equipe }}
                            </span>
                            <span class="pl-dialog__meta-item" [class.pl-dialog__meta-item--warn]="produit.stockTotal > 0 && produit.stockTotal < 8">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                                {{ stockLabel(produit) }}
                            </span>
                        </div>
                        <div class="pl-dialog__price">{{ produit.prix | number:'1.0-0' }} FCFA</div>
                        <div class="pl-dialog__actions">
                            <button class="pl-btn pl-btn--primary pl-btn--lg"
                                    (click)="ajouterRapideAuPanier(produit, $any($event)); apercuVisible = false">
                                Ajouter au panier
                            </button>
                            <button class="pl-btn pl-btn--outline pl-btn--lg"
                                    (click)="voirProduit(produit.id); apercuVisible = false">
                                Personnaliser
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </ng-container>
        </p-dialog>
    `,
    styles: [`
        :host {
            display: block;
            background: #faf7f2;
            color: #1a1a1a;
            font-family: 'Poppins', 'Segoe UI', sans-serif;
        }

        .pl-container {
            max-width: 1320px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }

        /* ===== BOUTONS ===== */
        .pl-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 0.03em;
            cursor: pointer;
            border: none;
            font-family: 'Poppins', sans-serif;
            transition: all 0.2s ease;
            text-decoration: none;
        }
        .pl-btn--primary {
            background: #FF4500;
            color: #ffffff;
            box-shadow: 0 2px 12px rgba(255, 69, 0, 0.25);
        }
        .pl-btn--primary:hover {
            background: #e03d00;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(255, 69, 0, 0.35);
        }
        .pl-btn--outline {
            background: transparent;
            color: #1a1a1a;
            border: 1.5px solid #d0c8bc;
        }
        .pl-btn--outline:hover {
            border-color: #FF4500;
            color: #FF4500;
        }
        .pl-btn--lg { padding: 0.85rem 1.8rem; font-size: 0.9rem; }
        .pl-btn--sm { padding: 0.45rem 0.9rem; font-size: 0.78rem; }

        /* Bouton outline dans le hero dark */
        .pl-hero .pl-btn--outline {
            color: rgba(255,255,255,0.85);
            border-color: rgba(255,255,255,0.3);
        }
        .pl-hero .pl-btn--outline:hover {
            border-color: #FF4500;
            color: #FF4500;
            background: rgba(255,69,0,0.08);
        }

        /* ===== HERO ===== */
        .pl-hero {
            position: relative;
            padding: 6rem 0 5rem;
            overflow: hidden;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a0800 35%, #0d1500 65%, #080c0a 100%);
        }
        .pl-hero::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
            background-size: 80px 80px;
            z-index: 0;
        }
        .pl-hero::after {
            content: '';
            position: absolute;
            inset: 0;
            background:
                radial-gradient(ellipse 70% 80% at 25% 50%, rgba(255, 69, 0, 0.13) 0%, transparent 65%),
                radial-gradient(ellipse 40% 60% at 80% 20%, rgba(255, 165, 0, 0.07) 0%, transparent 55%);
            z-index: 0;
        }
        .pl-hero__content {
            position: relative; z-index: 1;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }
        .pl-hero__kicker {
            display: inline-block;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.22em;
            color: #FF6B35;
            margin-bottom: 1rem;
            padding: 0.3rem 0.8rem;
            border: 1px solid rgba(255, 107, 53, 0.35);
            border-radius: 999px;
            background: rgba(255, 107, 53, 0.1);
        }
        .pl-hero__title {
            font-size: clamp(2.8rem, 6vw, 5rem);
            font-weight: 900;
            line-height: 0.98;
            letter-spacing: -0.025em;
            margin: 0 0 1.2rem;
            color: #ffffff;
            text-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }
        .pl-hero__title-accent { color: #FF4500; text-shadow: 0 0 40px rgba(255,69,0,0.4); }
        .pl-hero__subtitle {
            color: rgba(255,255,255,0.65);
            font-size: 1rem;
            line-height: 1.7;
            max-width: 44ch;
            margin: 0 0 2rem;
        }
        .pl-hero__ctas { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
        .pl-hero__stats { display: flex; align-items: center; gap: 1.5rem; }
        .pl-hero__stat strong { display: block; font-size: 1.5rem; font-weight: 800; color: #ffffff; line-height: 1; }
        .pl-hero__stat span { font-size: 0.72rem; color: rgba(255,255,255,0.45); letter-spacing: 0.04em; }
        .pl-hero__stat-divider { width: 1px; height: 32px; background: rgba(255,255,255,0.15); }
        .pl-hero__visual { display: flex; justify-content: center; align-items: center; }
        .pl-hero__badge-stack { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 320px; }
        .pl-hero__badge-card {
            display: flex; align-items: center; gap: 0.85rem;
            padding: 1rem 1.25rem;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 1rem;
            font-size: 0.88rem; font-weight: 600;
            color: rgba(255,255,255,0.9);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08);
            transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .pl-hero__badge-card:hover {
            transform: translateX(6px);
            background: rgba(255,255,255,0.09);
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .pl-hero__badge-icon { font-size: 1.25rem; }
        .pl-hero__badge-card--1 { border-left: 3px solid #FF4500; }
        .pl-hero__badge-card--2 { border-left: 3px solid #F5A623; margin-left: 1rem; }
        .pl-hero__badge-card--3 { border-left: 3px solid #25D366; margin-left: 2rem; }

        /* ===== CAROUSEL VEDETTES — FOND BLANC ===== */
        .pl-featured {
            padding: 4rem 0;
            background: #ffffff;
            border-bottom: 1px solid #ede8e0;
        }
        .pl-section-head { margin-bottom: 2.5rem; }
        .pl-section-kicker {
            display: inline-block;
            font-size: 0.65rem; font-weight: 700; letter-spacing: 0.22em;
            color: #FF4500; margin-bottom: 0.5rem;
        }
        .pl-section-title {
            font-size: 1.9rem; font-weight: 800; color: #111111;
            margin: 0 0 0.4rem; letter-spacing: -0.02em;
        }
        .pl-section-sub { color: #7a7068; font-size: 0.9rem; margin: 0; }

        /* Featured card */
        .pl-fcard {
            background: #ffffff;
            border: 1px solid #ede8e0;
            border-radius: 1rem; overflow: hidden; cursor: pointer;
            margin: 0 0.5rem;
            transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .pl-fcard:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
        .pl-fcard__img-wrap { position: relative; aspect-ratio: 4/5; overflow: hidden; background: #f5f0e6; }
        .pl-fcard__badge {
            position: absolute; top: 0.65rem; left: 0.65rem; z-index: 2;
            padding: 0.2rem 0.55rem; border-radius: 999px;
            background: #FF4500; color: #fff;
            font-size: 0.6rem; font-weight: 700; letter-spacing: 0.08em;
        }
        .pl-fcard__img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .pl-fcard:hover .pl-fcard__img { transform: scale(1.05); }
        .pl-fcard__body { padding: 0.9rem 1rem; }
        .pl-fcard__name {
            margin: 0 0 0.2rem; font-size: 0.88rem; font-weight: 600; color: #111111;
            line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pl-fcard__team { display: block; font-size: 0.72rem; color: #9e9490; margin-bottom: 0.4rem; }
        .pl-fcard__price { display: block; font-size: 0.95rem; font-weight: 700; color: #FF4500; }

        /* PrimeNG Carousel overrides */
        ::ng-deep .pl-carousel .p-carousel-item { padding: 0 0.25rem; }
        ::ng-deep .pl-carousel .p-carousel-prev,
        ::ng-deep .pl-carousel .p-carousel-next {
            background: #ffffff !important; border: 1px solid #ede8e0 !important;
            color: #333 !important; box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
            border-radius: 50% !important; width: 2.2rem !important; height: 2.2rem !important;
        }
        ::ng-deep .pl-carousel .p-carousel-prev:hover,
        ::ng-deep .pl-carousel .p-carousel-next:hover {
            background: #FF4500 !important; border-color: #FF4500 !important; color: #fff !important;
        }
        ::ng-deep .pl-carousel .p-carousel-indicators .p-carousel-indicator button {
            background: #d0c8bc !important; border-radius: 999px !important;
            width: 0.5rem !important; height: 0.5rem !important;
        }
        ::ng-deep .pl-carousel .p-carousel-indicators .p-carousel-indicator.p-highlight button {
            background: #FF4500 !important;
        }

        /* ===== CATÉGORIES ===== */
        .pl-categories { padding: 2.5rem 0; background: #faf7f2; }
        .pl-categories__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
        .pl-cat-card {
            padding: 1.2rem 1rem; background: #ffffff;
            border: 1.5px solid #ede8e0; border-radius: 0.9rem;
            cursor: pointer; font-family: 'Poppins', sans-serif;
            text-align: left; transition: all 0.2s ease;
            display: flex; flex-direction: column; gap: 0.3rem;
        }
        .pl-cat-card:hover { border-color: #FF4500; box-shadow: 0 4px 16px rgba(255,69,0,0.1); transform: translateY(-2px); }
        .pl-cat-card--active { background: rgba(255,69,0,0.05); border-color: #FF4500; }
        .pl-cat-card__icon { font-size: 1.35rem; line-height: 1; }
        .pl-cat-card__label { font-size: 0.8rem; font-weight: 600; color: #444; }
        .pl-cat-card--active .pl-cat-card__label { color: #FF4500; }
        .pl-cat-card__count { font-size: 1.3rem; font-weight: 800; color: #111111; }

        /* ===== TOOLBAR ===== */
        .pl-toolbar {
            padding: 1.25rem 0;
            background: #faf7f2;
            border-bottom: 1px solid #ede8e0;
            position: sticky; top: 68px; z-index: 10;
        }
        .pl-toolbar__inner {
            display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;
        }
        .pl-toolbar__filters {
            display: flex; gap: 0.4rem; flex-wrap: wrap; flex: 1;
        }
        .pl-toolbar__page-size {
            display: flex; align-items: center; gap: 0.5rem;
            padding-left: 0.35rem; margin-left: 0.35rem;
            border-left: 1px solid #e5ddd3;
        }
        .pl-toolbar__page-size-label {
            color: #7d7268; font-size: 0.75rem; font-weight: 600;
            white-space: nowrap; letter-spacing: 0.02em;
        }
        .pl-toolbar__page-size-select {
            min-width: 55px; padding: 0.42rem 0.7rem;
            background: #ffffff; border: 1.5px solid #ddd8d0;
            border-radius: 0.9rem; color: #444; font-size: 0.78rem;
            font-family: 'Poppins', sans-serif; outline: none;
            transition: border-color 0.2s ease, color 0.2s ease;
        }
        .pl-toolbar__page-size-select:focus {
            border-color: #FF4500; color: #1a1a1a;
        }
        .pl-toolbar__actions {
            display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0;
        }
        .pl-filter-btn {
            padding: 0.45rem 0.9rem; background: transparent;
            border: 1.5px solid #ddd8d0; border-radius: 999px;
            color: #666; font-size: 0.78rem; font-weight: 500;
            cursor: pointer; font-family: 'Poppins', sans-serif;
            transition: all 0.18s ease; white-space: nowrap;
        }
        .pl-filter-btn:hover { border-color: #FF4500; color: #FF4500; }
        .pl-filter-btn--active { background: #FF4500; border-color: #FF4500; color: #ffffff; }
        .pl-filter-btn__count { opacity: 0.7; font-size: 0.7rem; }

        .pl-search {
            display: flex; align-items: center; gap: 0.6rem;
            padding: 0.5rem 1rem;
            background: #ffffff; border: 1.5px solid #ddd8d0;
            border-radius: 999px; min-width: 240px;
            transition: border-color 0.2s ease; color: #888;
        }
        .pl-search:focus-within { border-color: #FF4500; color: #FF4500; }
        .pl-search__input {
            flex: 1; background: transparent; border: none; outline: none;
            color: #1a1a1a; font-size: 0.83rem; font-family: 'Poppins', sans-serif;
        }
        .pl-search__input::placeholder { color: #bbb5ad; }
        .pl-search__clear {
            background: none; border: none; color: #aaa; cursor: pointer;
            padding: 0; display: flex; align-items: center; transition: color 0.15s;
        }
        .pl-search__clear:hover { color: #FF4500; }

        /* ===== SÉLECTEUR DE VUE ===== */
        .pl-view-switcher {
            display: flex; align-items: center;
            background: #ffffff; border: 1.5px solid #ddd8d0;
            border-radius: 0.6rem; padding: 0.2rem; gap: 0.1rem;
        }
        .pl-view-btn {
            width: 30px; height: 28px; border: none; background: transparent;
            border-radius: 0.35rem; color: #aaa; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.15s ease;
        }
        .pl-view-btn:hover { color: #FF4500; background: rgba(255,69,0,0.07); }
        .pl-view-btn--active { background: #FF4500; color: #ffffff; }
        .pl-view-btn--active:hover { background: #e03d00; color: #ffffff; }

        /* ===== SECTION PRODUITS ===== */
        .pl-products { padding: 3rem 0 5rem; background: #f5f0e6; }

        /* Skeleton */
        .pl-skeleton-card {
            background: #ffffff; border: 1px solid #ede8e0;
            border-radius: 1rem; overflow: hidden;
        }
        .pl-skeleton-card__body { padding: 0.9rem; }

        /* Animation grille */
        @keyframes cardReveal {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* Sections — animation d'apparition DOM */
        @keyframes pl-section-reveal {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .pl-featured, .pl-categories, .pl-products {
            animation: pl-section-reveal 0.65s ease both;
        }

        /* ===== GRILLE DE BASE ===== */
        .pl-grid {
            display: grid;
            gap: 1.5rem;
            align-items: start;
        }
        .pl-grid--classic { grid-template-columns: repeat(4, 1fr); }
        .pl-grid--premium { grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .pl-grid--mini    { grid-template-columns: repeat(6, 1fr); gap: 0.75rem; }

        /* ===== CARD CLASSIQUE ===== */
        .pl-card {
            background: #ffffff; border: 1px solid #ede8e0;
            border-radius: 1rem; overflow: hidden; cursor: pointer;
            transition: transform 0.28s ease, box-shadow 0.28s ease;
            animation: cardReveal 0.45s ease both;
            display: flex; flex-direction: column;
        }
        .pl-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(0,0,0,0.12); }

        .pl-card__img-wrap {
            position: relative; aspect-ratio: 3/4;
            background: #f5f0e6; overflow: hidden;
        }
        .pl-card__badge {
            position: absolute; top: 0.65rem; left: 0.65rem; z-index: 2;
            padding: 0.22rem 0.55rem; border-radius: 999px;
            background: #FF4500; color: #fff; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.08em;
        }
        .pl-card__stock-badge {
            position: absolute; top: 0.65rem; right: 0.65rem; z-index: 2;
            padding: 0.22rem 0.55rem; border-radius: 999px;
            background: #F5A623; color: #000; font-size: 0.6rem; font-weight: 700;
        }
        .pl-card__img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 0.45s ease;
        }
        .pl-card:hover .pl-card__img { transform: scale(1.06); }

        .pl-card__overlay {
            position: absolute; inset: 0;
            background: rgba(0,0,0,0.38);
            display: flex; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.28s ease; z-index: 3;
        }
        .pl-card:hover .pl-card__overlay { opacity: 1; }

        .pl-card__overlay-btn {
            display: flex; align-items: center; gap: 0.4rem;
            padding: 0.55rem 1.1rem;
            background: #ffffff; color: #111; border: none; border-radius: 999px;
            font-size: 0.78rem; font-weight: 600; cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transform: translateY(6px);
            transition: transform 0.28s ease, background 0.2s ease, color 0.2s ease;
        }
        .pl-card:hover .pl-card__overlay-btn { transform: translateY(0); }
        .pl-card__overlay-btn:hover { background: #FF4500; color: #fff; }

        .pl-card__body {
            padding: 0.85rem 1rem; display: flex; flex-direction: column; gap: 0.6rem; flex-shrink: 0;
        }
        .pl-card__name { margin: 0; font-size: 0.88rem; font-weight: 600; color: #111111; line-height: 1.3; }
        .pl-card__team { font-size: 0.72rem; color: #9e9490; }
        .pl-card__sur-commande {
            display: inline-flex; align-items: center; gap: 0.3rem;
            font-size: 0.68rem; font-weight: 600; color: #FF6B35;
            background: rgba(255, 107, 53, 0.1); border: 1px solid rgba(255,107,53,0.25);
            border-radius: 999px; padding: 0.18rem 0.55rem; width: fit-content;
        }
        .pl-card__footer { display: flex; align-items: center; justify-content: space-between; }
        .pl-card__price small { display: block; font-size: 0.62rem; color: #bbb5ad; letter-spacing: 0.04em; }
        .pl-card__price strong { font-size: 1rem; font-weight: 700; color: #FF4500; }
        .pl-card__price strong span { font-size: 0.7rem; font-weight: 500; color: #9e9490; }

        .pl-card__add-btn {
            width: 34px; height: 34px; border-radius: 50%;
            background: #f5f0e6; border: 1.5px solid #ddd8d0;
            color: #555; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.18s ease; flex-shrink: 0;
        }
        .pl-card__add-btn:hover { background: #FF4500; border-color: #FF4500; color: #ffffff; transform: scale(1.1); }

        /* ===== CARD PREMIUM ===== */
        .pl-card--premium {
            border-radius: 1.2rem; overflow: hidden; cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            animation: cardReveal 0.45s ease both;
            border: none; background: transparent;
            display: block;
        }
        .pl-card--premium:hover { transform: translateY(-6px); box-shadow: 0 24px 64px rgba(0,0,0,0.18); }
        .pl-card--premium .pl-card__img-wrap {
            aspect-ratio: 3/4; position: relative; overflow: hidden;
            border-radius: 1.2rem; background: #111;
        }
        .pl-card--premium .pl-card__img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 0.55s ease, opacity 0.4s ease;
        }
        .pl-card--premium:hover .pl-card__img { transform: scale(1.1); opacity: 0.75; }

        /* Overlay CTA hover */
        .pl-card__premium-hover {
            position: absolute; inset: 0;
            display: flex; align-items: center; justify-content: center;
            z-index: 4; opacity: 0;
            transition: opacity 0.3s ease;
        }
        .pl-card--premium:hover .pl-card__premium-hover { opacity: 1; }
        .pl-card__premium-cta {
            display: flex; align-items: center; gap: 0.5rem;
            padding: 0.7rem 1.5rem;
            background: #FF4500; color: #fff; border: none;
            border-radius: 999px; font-size: 0.85rem; font-weight: 700;
            cursor: pointer; font-family: 'Poppins', sans-serif;
            transform: translateY(10px);
            transition: transform 0.3s ease, background 0.2s ease;
            box-shadow: 0 4px 24px rgba(255,69,0,0.45);
        }
        .pl-card--premium:hover .pl-card__premium-cta { transform: translateY(0); }
        .pl-card__premium-cta:hover { background: #e03d00; }

        /* Footer infos toujours visible */
        .pl-card__premium-footer {
            position: absolute; bottom: 0; left: 0; right: 0;
            padding: 1.8rem 1.2rem 1.2rem;
            background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 50%, transparent 100%);
            display: flex; align-items: flex-end; justify-content: space-between; gap: 0.5rem; z-index: 3;
        }
        .pl-card__premium-info { flex: 1; min-width: 0; }
        .pl-card__premium-name {
            color: #fff; font-size: 0.92rem; font-weight: 700;
            margin: 0 0 0.15rem; line-height: 1.3;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pl-card__premium-team { font-size: 0.7rem; color: rgba(255,255,255,0.55); display: block; }
        .pl-card__premium-price {
            color: #FF6B35; font-size: 1.05rem; font-weight: 800;
            white-space: nowrap; text-align: right; flex-shrink: 0;
        }
        .pl-card__premium-price small {
            font-size: 0.58rem; font-weight: 500;
            color: rgba(255,255,255,0.45); margin-left: 2px; display: block;
        }

        /* ===== MASONRY ===== */
        .pl-masonry {
            columns: 4;
            column-gap: 1.5rem;
        }
        .pl-card--masonry {
            break-inside: avoid;
            margin-bottom: 1.5rem;
            display: inline-block;
            width: 100%;
        }
        /* Hauteurs variées selon position */
        .pl-card--masonry:nth-child(4n+1) .pl-card__img-wrap { aspect-ratio: 3/4; }
        .pl-card--masonry:nth-child(4n+2) .pl-card__img-wrap { aspect-ratio: 4/5; }
        .pl-card--masonry:nth-child(4n+3) .pl-card__img-wrap { aspect-ratio: 1/1; }
        .pl-card--masonry:nth-child(4n)   .pl-card__img-wrap { aspect-ratio: 2/3; }

        /* ===== CARDS DÉCORATIVES ===== */
        .pl-deco-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,69,0,0.04) 100%);
            border: 1.5px dashed rgba(255,69,0,0.22);
            border-radius: 1rem; overflow: hidden;
            display: flex; align-items: center; justify-content: center;
            min-height: 200px;
            transition: border-color 0.25s ease, background 0.25s ease;
        }
        .pl-deco-card--alt {
            background: linear-gradient(135deg, rgba(245,166,35,0.04) 0%, rgba(255,255,255,0.06) 100%);
            border-color: rgba(245,166,35,0.22);
        }
        .pl-deco-card:hover { border-color: rgba(255,69,0,0.45); background: rgba(255,69,0,0.06); }
        .pl-deco-card__inner { text-align: center; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; }
        .pl-deco-card__ball { width: 64px; height: 64px; color: #FF4500; opacity: 0.5; animation: decoSpin 12s linear infinite; }
        .pl-deco-card--alt .pl-deco-card__ball { color: #F5A623; animation-direction: reverse; }
        @keyframes decoSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .pl-deco-card__label { font-size: 0.82rem; font-weight: 600; color: #888; margin: 0; letter-spacing: 0.03em; }
        .pl-deco-card__sub { font-size: 0.7rem; color: #bbb; letter-spacing: 0.06em; }

        /* ===== VUE LISTE ===== */
        .pl-list { display: flex; flex-direction: column; gap: 1rem; }

        .pl-list-item {
            display: grid;
            grid-template-columns: 200px 1fr;
            background: #ffffff;
            border: 1px solid #ede8e0;
            border-radius: 1rem; overflow: hidden; cursor: pointer;
            transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s ease;
            animation: cardReveal 0.45s ease both;
        }
        .pl-list-item:hover {
            transform: translateX(4px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            border-color: rgba(255,69,0,0.35);
        }
        .pl-list-item__img-wrap {
            overflow: hidden; background: #f5f0e6;
            width: 200px; min-height: 200px;
        }
        .pl-list-item__img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 0.4s ease;
        }
        .pl-list-item:hover .pl-list-item__img { transform: scale(1.06); }
        .pl-list-item__body {
            padding: 1.5rem; display: flex; flex-direction: column;
            justify-content: space-between; gap: 0.75rem;
        }
        .pl-list-item__tags { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
        .pl-list-item__name { font-size: 1.2rem; font-weight: 700; color: #111; margin: 0 0 0.2rem; }
        .pl-list-item__team { font-size: 0.8rem; color: #9e9490; display: block; margin-bottom: 0.5rem; }
        .pl-list-item__desc {
            font-size: 0.85rem; color: #666; line-height: 1.6; margin: 0;
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .pl-list-item__bottom {
            display: flex; align-items: center;
            justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
        }
        .pl-list-item__actions { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }

        /* ===== MINI CARDS ===== */
        .pl-mini-card {
            background: #ffffff; border: 1px solid #ede8e0;
            border-radius: 0.75rem; overflow: hidden; cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            animation: cardReveal 0.35s ease both;
        }
        .pl-mini-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .pl-mini-card__img-wrap {
            position: relative; aspect-ratio: 1/1;
            overflow: hidden; background: #f5f0e6;
        }
        .pl-mini-card__badge {
            position: absolute; top: 0.35rem; left: 0.35rem; z-index: 2;
            padding: 0.12rem 0.35rem; background: #FF4500; color: #fff;
            border-radius: 999px; font-size: 0.52rem; font-weight: 700;
        }
        .pl-mini-card__img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 0.35s ease;
        }
        .pl-mini-card:hover .pl-mini-card__img { transform: scale(1.08); }
        .pl-mini-card__overlay {
            position: absolute; inset: 0;
            background: rgba(0,0,0,0.35);
            display: flex; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.25s ease;
        }
        .pl-mini-card:hover .pl-mini-card__overlay { opacity: 1; }
        .pl-mini-card__add-btn {
            width: 30px; height: 30px; border-radius: 50%;
            background: #fff; border: none; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            color: #111; transition: background 0.2s ease, color 0.2s ease;
        }
        .pl-mini-card__add-btn:hover { background: #FF4500; color: #fff; }
        .pl-mini-card__body { padding: 0.5rem 0.6rem; }
        .pl-mini-card__name {
            font-size: 0.68rem; font-weight: 600; color: #222;
            margin: 0 0 0.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pl-mini-card__price { font-size: 0.66rem; font-weight: 700; color: #FF4500; }

        /* ===== SHOWCASE (VITRINE) ===== */
        .pl-showcase { display: flex; flex-direction: column; gap: 2rem; }

        .pl-showcase-item {
            display: grid; grid-template-columns: 1fr 1fr;
            min-height: 480px;
            border-radius: 1.5rem; overflow: hidden;
            background: #ffffff; border: 1px solid #ede8e0;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            animation: cardReveal 0.5s ease both;
        }
        .pl-showcase-item:hover {
            transform: translateY(-4px);
            box-shadow: 0 28px 80px rgba(0,0,0,0.13);
        }
        .pl-showcase-item--reverse .pl-showcase-item__img-wrap { order: 2; }
        .pl-showcase-item--reverse .pl-showcase-item__body  { order: 1; }

        .pl-showcase-item__img-wrap { overflow: hidden; background: #f5f0e6; }
        .pl-showcase-item__img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 0.55s ease;
        }
        .pl-showcase-item:hover .pl-showcase-item__img { transform: scale(1.05); }

        .pl-showcase-item__body {
            padding: 3rem 2.5rem; display: flex; flex-direction: column;
            justify-content: center; gap: 0.85rem;
        }
        .pl-showcase-item__kicker {
            font-size: 0.62rem; font-weight: 700; letter-spacing: 0.18em; color: #FF4500;
            background: rgba(255,69,0,0.08); border: 1px solid rgba(255,69,0,0.2);
            border-radius: 999px; padding: 0.25rem 0.8rem;
            display: inline-block; width: fit-content;
        }
        .pl-showcase-item__name {
            font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 800; color: #111;
            line-height: 1.1; letter-spacing: -0.02em; margin: 0;
        }
        .pl-showcase-item__team { font-size: 0.88rem; color: #888; }
        .pl-showcase-item__desc {
            font-size: 0.88rem; color: #666; line-height: 1.7; margin: 0;
            display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .pl-showcase-item__price {
            font-size: 2rem; font-weight: 800; color: #FF4500;
            letter-spacing: -0.03em; line-height: 1;
        }
        .pl-showcase-item__price span { font-size: 1rem; font-weight: 600; color: #9e9490; margin-left: 4px; }
        .pl-showcase-item__stock {
            display: flex; align-items: center; gap: 0.35rem;
            font-size: 0.78rem; color: #e07c00; font-weight: 500;
        }
        .pl-showcase-item__actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; }

        /* ===== EMPTY STATE ===== */
        .pl-empty {
            text-align: center; padding: 5rem 2rem;
            border: 1.5px dashed #ddd8d0; border-radius: 1.5rem; background: #ffffff;
        }
        .pl-empty__icon { margin-bottom: 1.2rem; }
        .pl-empty h3 { font-size: 1.2rem; font-weight: 700; color: #333; margin: 0 0 0.6rem; }
        .pl-empty p { color: #999; max-width: 36ch; margin: 0 auto 2rem; }

        /* ===== PAGINATOR ===== */
        .pl-paginator-wrap { margin-top: 3rem; display: flex; justify-content: center; }
        ::ng-deep .pl-paginator .p-paginator {
            background: transparent !important; border: none !important; gap: 0.3rem !important;
        }
        ::ng-deep .pl-paginator .p-paginator-page,
        ::ng-deep .pl-paginator .p-paginator-prev,
        ::ng-deep .pl-paginator .p-paginator-next,
        ::ng-deep .pl-paginator .p-paginator-first,
        ::ng-deep .pl-paginator .p-paginator-last {
            background: #ffffff !important; border: 1.5px solid #ddd8d0 !important;
            color: #444 !important; border-radius: 0.5rem !important;
            min-width: 2.2rem !important; height: 2.2rem !important;
            font-family: 'Poppins', sans-serif !important; font-size: 0.82rem !important;
        }
        ::ng-deep .pl-paginator .p-paginator-page:hover,
        ::ng-deep .pl-paginator .p-paginator-prev:hover,
        ::ng-deep .pl-paginator .p-paginator-next:hover {
            border-color: #FF4500 !important; color: #FF4500 !important;
        }
        ::ng-deep .pl-paginator .p-paginator-page.p-highlight {
            background: #FF4500 !important; border-color: #FF4500 !important; color: #ffffff !important;
        }
        ::ng-deep .pl-paginator .p-dropdown {
            border: 1.5px solid #ddd8d0 !important; border-radius: 0.5rem !important;
            background: #ffffff !important;
        }

        /* ===== DIALOG ===== */
        ::ng-deep .pl-dialog .p-dialog {
            background: #ffffff !important; border: 1px solid #ede8e0 !important;
            border-radius: 1.2rem !important; box-shadow: 0 24px 80px rgba(0,0,0,0.18) !important;
        }
        ::ng-deep .pl-dialog .p-dialog-header {
            background: #faf7f2 !important; border-bottom: 1px solid #ede8e0 !important;
            border-radius: 1.2rem 1.2rem 0 0 !important; padding: 1rem 1.5rem !important;
        }
        ::ng-deep .pl-dialog .p-dialog-content {
            background: #ffffff !important; padding: 1.5rem !important;
            border-radius: 0 0 1.2rem 1.2rem !important;
        }
        ::ng-deep .pl-dialog .p-dialog-header-icon { color: #666 !important; }
        ::ng-deep .pl-dialog .p-dialog-header-icon:hover { background: #f0ebe3 !important; color: #111 !important; }

        .pl-dialog__header { display: flex; align-items: center; gap: 0.75rem; }
        .pl-dialog__badge {
            padding: 0.18rem 0.6rem; background: rgba(255,69,0,0.1);
            border: 1px solid rgba(255,69,0,0.25); color: #FF4500;
            border-radius: 999px; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em;
        }
        .pl-dialog__title { font-size: 0.95rem; font-weight: 700; color: #111111; }
        .pl-dialog__body {
            display: grid; grid-template-columns: minmax(180px, 300px) 1fr; gap: 1.5rem;
        }
        .pl-dialog__img-wrap {
            aspect-ratio: 4/5; border-radius: 0.85rem;
            overflow: hidden; background: #f5f0e6;
        }
        .pl-dialog__img { width: 100%; height: 100%; object-fit: cover; }
        .pl-dialog__desc { color: #666; font-size: 0.88rem; line-height: 1.7; margin: 0 0 1rem; }
        .pl-dialog__meta { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.2rem; }
        .pl-dialog__meta-item { display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; color: #888; }
        .pl-dialog__meta-item--warn { color: #e07c00; }
        .pl-dialog__price { font-size: 1.9rem; font-weight: 800; color: #FF4500; margin-bottom: 1.5rem; letter-spacing: -0.02em; }
        .pl-dialog__actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1200px) {
            .pl-grid--classic { grid-template-columns: repeat(3, 1fr); }
            .pl-grid--mini    { grid-template-columns: repeat(4, 1fr); }
            .pl-masonry       { columns: 3; }
        }

        @media (max-width: 1024px) {
            .pl-hero__content { grid-template-columns: 1fr; text-align: center; }
            .pl-hero__subtitle { margin-left: auto; margin-right: auto; }
            .pl-hero__ctas { justify-content: center; }
            .pl-hero__stats { justify-content: center; }
            .pl-hero__visual { display: none; }
            .pl-hero { padding: 3.5rem 0 3rem; }
            .pl-categories__grid { grid-template-columns: repeat(2, 1fr); }
            .pl-grid--classic { grid-template-columns: repeat(3, 1fr); }
            .pl-grid--premium { grid-template-columns: repeat(2, 1fr); }
            .pl-showcase-item { min-height: 380px; }
        }

        @media (max-width: 768px) {
            .pl-toolbar__inner { flex-direction: column; align-items: stretch; }
            .pl-toolbar__actions { flex-wrap: wrap; justify-content: space-between; }
            .pl-search { min-width: 0; flex: 1; }

            .pl-grid--classic { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
            .pl-grid--premium { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
            .pl-grid--mini    { grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
            .pl-masonry       { columns: 2; }

            .pl-list-item { grid-template-columns: 140px 1fr; }
            .pl-list-item__img-wrap { width: 140px; min-height: 160px; }
            .pl-list-item__name { font-size: 1rem; }

            .pl-showcase-item { grid-template-columns: 1fr; min-height: auto; }
            .pl-showcase-item--reverse .pl-showcase-item__img-wrap { order: 0; }
            .pl-showcase-item--reverse .pl-showcase-item__body  { order: 0; }
            .pl-showcase-item__img-wrap { height: 260px; }
            .pl-showcase-item__body { padding: 1.5rem; }
            .pl-showcase-item__name { font-size: 1.4rem; }

            .pl-dialog__body { grid-template-columns: 1fr; }
        }

        @media (max-width: 480px) {
            .pl-grid--classic { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
            .pl-grid--premium { grid-template-columns: 1fr; }
            .pl-grid--mini    { grid-template-columns: repeat(2, 1fr); }
            .pl-masonry       { columns: 2; column-gap: 0.75rem; }
            .pl-card--masonry { margin-bottom: 0.75rem; }

            .pl-list-item { grid-template-columns: 1fr; }
            .pl-list-item__img-wrap { width: 100%; height: 220px; min-height: auto; }

            .pl-hero__ctas { flex-direction: column; }
            .pl-hero__ctas .pl-btn { width: 100%; justify-content: center; }
        }
    `]
})
export class ProductListComponent implements OnInit {
    produits: Produit[] = [];
    produitsFiltres: Produit[] = [];
    chargement = true;
    recherche = '';
    apercuVisible = false;
    produitSelectionne: Produit | null = null;
    private readonly fallbackImage = '/images/app/login.png';

    rowsPerPage = 12;
    rowsPerPageOptions = [8, 12, 16, 24];
    currentPage = 0;

    ongletActif: OngletId = 'tous';
    onglets: { id: OngletId; label: string }[] = [
        { id: 'tous', label: 'Tous' },
        { id: 'actuel', label: 'Actuels' },
        { id: 'vintage-court', label: 'Vintage Court' },
        { id: 'vintage-long', label: 'Vintage Long' },
        { id: 'collection', label: 'Collection' }
    ];

    vueMode: VueMode = 'grid-classic';

    /* Nombre d'items par page selon le mode d'affichage */
    private readonly rowsParMode: Record<VueMode, number> = {
        'grid-classic': 12,
        'grid-premium': 9,
        'masonry':      12,
        'list':         8,
        'mini':         18,
        'showcase':     4,
    };

    carouselOptions = [
        { breakpoint: '1200px', numVisible: 4, numScroll: 1 },
        { breakpoint: '992px',  numVisible: 3, numScroll: 1 },
        { breakpoint: '768px',  numVisible: 2, numScroll: 1 },
        { breakpoint: '480px',  numVisible: 1, numScroll: 1 }
    ];

    public produitService  = inject(ProduitService);
    private router         = inject(Router);
    private route          = inject(ActivatedRoute);
    private panierService  = inject(PanierService);
    private messageService = inject(MessageService);

    statNbMaillots = 0;

    get produitsFeatured(): Produit[] {
        return this.produits.slice(0, 8);
    }

    get produitsPagines(): Produit[] {
        const start = this.currentPage * this.rowsPerPage;
        return this.produitsFiltres.slice(start, start + this.rowsPerPage);
    }

    /* Cards décoratives pour combler la grille classique (4 colonnes) */
    get cartesDecoratives(): number[] {
        if (this.vueMode !== 'grid-classic') return [];
        const count = this.produitsPagines.length;
        if (count === 0) return [];
        const remainder = count % 4;
        const needed = remainder === 0 ? 0 : 4 - remainder;
        return Array.from({ length: needed }, (_, i) => i);
    }

    ngOnInit(): void {
        /* Restaurer la vue sauvegardée */
        const savedVue = localStorage.getItem('shop_droping_vue_mode') as VueMode | null;
        if (savedVue && this.rowsParMode[savedVue] !== undefined) {
            this.vueMode     = savedVue;
            this.rowsPerPage = this.rowsParMode[savedVue];
        }

        this.route.queryParams.subscribe(params => {
            if (params['tab'] && this.isValidOnglet(params['tab'])) {
                this.ongletActif = params['tab'] as OngletId;
            }
        });

        this.chargement = true;
        this.produitService.getProduits().subscribe({
            next: (data) => {
                this.produits = data;
                this.filtrerProduits();
                this.chargement = false;
                setTimeout(() => this.animerCompteur(data.length), 300);
            },
            error: () => { this.chargement = false; }
        });
    }

    changerVue(mode: VueMode): void {
        this.vueMode     = mode;
        this.rowsPerPage = this.rowsParMode[mode];
        this.currentPage = 0;
        localStorage.setItem('shop_droping_vue_mode', mode);
    }

    private isValidOnglet(val: string): val is OngletId {
        return ['tous', 'actuel', 'vintage-court', 'vintage-long', 'collection'].includes(val);
    }

    changerOnglet(ongletId: OngletId): void {
        this.ongletActif = ongletId;
        this.currentPage = 0;
        this.filtrerProduits();
    }

    filtrerProduits(): void {
        const terme = this.recherche.trim().toLowerCase();
        const base = this.ongletActif === 'tous'
            ? this.produits
            : this.produits.filter((p) => this.categoryMatchesTab(p.categorie, this.ongletActif));

        this.produitsFiltres = !terme
            ? base
            : base.filter((p) =>
                [p.nom, p.description, p.categorie, p.equipe]
                    .filter(Boolean).join(' ').toLowerCase().includes(terme)
            );
        this.currentPage = 0;
    }

    private normalizeCategorie(categorie?: string): string {
        return (categorie ?? '').trim().toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/\s+/g, '-').replace(/_/g, '-').replace(/-+/g, '-');
    }

    private categoryMatchesTab(categorie: string, onglet: OngletId): boolean {
        const normalized = this.normalizeCategorie(categorie);
        if (normalized === onglet) return true;
        if (onglet === 'vintage-court') return normalized.includes('vintage') && (normalized.includes('court') || normalized.includes('courte'));
        if (onglet === 'vintage-long')  return normalized.includes('vintage') && (normalized.includes('long') || normalized.includes('longue'));
        if (onglet === 'actuel')        return normalized.includes('actuel') || normalized.includes('nouveau');
        if (onglet === 'collection')    return normalized.includes('collection') || normalized.includes('retro') || normalized.includes('collector');
        return false;
    }

    reinitialiserFiltres(): void {
        this.recherche = '';
        this.changerOnglet('tous');
    }

    labelCategorie(categorie: string): string {
        const map: Record<string, string> = {
            'actuel':        'Actuel',
            'vintage-court': 'Vintage',
            'vintage-long':  'Vintage Long',
            'collection':    'Collection'
        };
        return map[categorie] ?? 'Édition';
    }

    countByTab(ongletId: OngletId): number {
        if (ongletId === 'tous') return this.produits.length;
        return this.produits.filter((p) => this.categoryMatchesTab(p.categorie, ongletId)).length;
    }

    stockLabel(produit: Produit): string {
        if (!produit.enStock || produit.stockTotal <= 0) return 'Rupture de stock';
        if (produit.stockTotal < 8) return `Derniers articles (${produit.stockTotal})`;
        return `${produit.stockTotal} en stock`;
    }

    onPageChange(event: PaginatorState): void {
        this.currentPage = event.page ?? 0;
        this.rowsPerPage = event.rows ?? this.rowsPerPage;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    onRowsPerPageChange(rows: number): void {
        this.rowsPerPage = rows;
        this.currentPage = 0;
        // window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement | null;
        if (img && !img.src.includes(this.fallbackImage)) {
            img.src = this.fallbackImage;
        }
    }

    allerAuPanier(): void { this.router.navigate(['/boutique/panier']); }

    ouvrirApercuProduit(produit: Produit): void {
        this.produitSelectionne = produit;
        this.apercuVisible      = true;
    }

    voirProduit(id: number, event?: Event): void {
        event?.stopPropagation();
        this.router.navigate(['/boutique/product-overview', id]);
    }

    ajouterRapideAuPanier(produit: Produit, event: MouseEvent): void {
        event.stopPropagation();
        this.panierService.ajouterAuPanier(
            produit,
            { taille: 'M', couleur: 'Standard', badgesOfficiels: false, flocage: false },
            1, 0
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Ajouté au panier',
            detail: `${produit.nom} ajouté avec succès.`
        });
    }

    private animerCompteur(fin: number, duree = 1400): void {
        const debut = Date.now();
        const step = () => {
            const elapsed  = Date.now() - debut;
            const progress = Math.min(elapsed / duree, 1);
            const ease     = 1 - Math.pow(1 - progress, 3);
            this.statNbMaillots = Math.round(ease * fin);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }
}
