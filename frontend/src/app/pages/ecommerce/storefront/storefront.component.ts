import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopHeaderComponent } from './components/header.component';
import { ShopHeroComponent } from './components/hero.component';
import { ShopCategoriesComponent } from './components/categories.component';
import { ShopFlashSaleComponent } from './components/flash-sale.component';
import { ShopTodaysForyouComponent } from './components/todays-for-you.component';
import { ShopBestStoresComponent } from './components/best-stores.component';
import { ShopFooterComponent } from './components/footer.component';

import { ProduitService, Produit } from '@services/produit.service';

@Component({
  selector: 'app-storefront',
  standalone: true,
  imports: [
    CommonModule, 
    ShopHeaderComponent, 
    ShopHeroComponent, 
    ShopCategoriesComponent, 
    ShopFlashSaleComponent, 
    ShopTodaysForyouComponent, 
    ShopBestStoresComponent, 
    ShopFooterComponent
  ],
  template: `
    <div class="min-h-screen bg-white font-sans text-gray-800">
      <app-shop-header></app-shop-header>
      <main *ngIf="!loading">
        <app-shop-hero></app-shop-hero>
        <app-shop-categories></app-shop-categories>
        <app-shop-flash-sale [produits]="produitsEnAvant"></app-shop-flash-sale>
        <app-shop-todays-foryou [produits]="produitsJour"></app-shop-todays-foryou>
        <app-shop-best-stores></app-shop-best-stores>
      </main>
      <app-shop-footer></app-shop-footer>
    </div>
  `
})
export class StorefrontComponent implements OnInit {
  produitsEnAvant: Produit[] = [];
  produitsJour: Produit[] = [];
  loading = true;

  constructor(private produitService: ProduitService) {}

  ngOnInit() {
    this.produitService.getProduits().subscribe({
      next: (produits: Produit[]) => {
        // Just mocking up split of real backend data for display
        this.produitsEnAvant = produits.slice(0, 4);
        this.produitsJour = produits.slice(4, 12);
        this.loading = false;
      },
      error: () => {
        // Fallback or handle error
        this.loading = false;
      }
    });
  }
}
