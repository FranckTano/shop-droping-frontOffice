import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produit } from '@services/produit.service';

@Component({
  selector: 'app-shop-flash-sale',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 py-10 max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-2xl font-bold">
            <i class="pi pi-bolt text-black text-2xl"></i>
            <span>Flash Sale</span>
          </div>
          <!-- Timer -->
          <div class="flex items-center gap-1.5 text-white font-semibold text-sm">
            <span class="w-8 h-8 rounded-md bg-red-500 flex items-center justify-center">08</span>
            <span class="text-red-500 font-bold">:</span>
            <span class="w-8 h-8 rounded-md bg-red-500 flex items-center justify-center">17</span>
            <span class="text-red-500 font-bold">:</span>
            <span class="w-8 h-8 rounded-md bg-red-500 flex items-center justify-center">56</span>
          </div>
        </div>

        <div class="flex gap-2">
          <button class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600">
            <i class="pi pi-arrow-left"></i>
          </button>
          <button class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors text-gray-600">
            <i class="pi pi-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Products Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        <div class="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 group relative" *ngFor="let p of displayProducts">
          <!-- Favorite Icon -->
          <button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:text-red-500">
            <i class="pi pi-heart"></i>
          </button>
          
          <div class="bg-gray-200 h-56 m-2 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
             <!-- Product image -->
            <img [src]="p.img" alt="product image" class="w-full h-full object-cover mix-blend-multiply" *ngIf="p.img" />
          </div>
          
          <div class="px-4 pb-5">
            <h3 class="font-bold text-gray-900 text-sm leading-tight h-10 line-clamp-2 mb-2">{{ p.name }}</h3>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-lg font-bold text-black">{{ p.price | currency:'EUR':'symbol' }}</span>
              <span class="text-xs text-gray-400 line-through">{{ p.originalPrice | currency:'EUR':'symbol' }}</span>
            </div>
            
            <!-- Progress bar -->
            <div class="flex items-center gap-3">
              <div class="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-black rounded-full" [style.width]="(p.sold / p.total) * 100 + '%'"></div>
              </div>
              <span class="text-xs text-gray-400 font-medium whitespace-nowrap">{{ p.sold }}/{{ p.total }} Sale</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class ShopFlashSaleComponent implements OnChanges {
  @Input() produits: Produit[] = [];

  displayProducts: any[] = [];
  fallbackProducts = [
    { name: "EliteShield Performance Men's Jackets", price: 255.000, originalPrice: 525.000, sold: 9, total: 10, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400' },
    { name: "Gentlemen's Summer Gray Hat - Premium Blend", price: 99.000, originalPrice: 150.000, sold: 9, total: 10, img: 'https://images.unsplash.com/photo-1580975608826-bb212675de6f?auto=format&fit=crop&q=80&w=400' },
    { name: "OptiZoom Camera Shoulder Bag", price: 250.000, originalPrice: 425.000, sold: 5, total: 10, img: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=400' },
    { name: "Cloudy Chic - Grey Peep Toe Heeled Sandals", price: 270.000, originalPrice: 580.000, sold: 5, total: 10, img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400' }
  ];

  ngOnChanges() {
    if (this.produits && this.produits.length > 0) {
      this.displayProducts = this.produits.map(p => ({
        name: p.nom,
        price: p.prix,
        originalPrice: p.prix * 1.5,
        sold: Math.floor(Math.random() * 8) + 1,
        total: 10,
        img: p.imageUrl || this.fallbackProducts[Math.floor(Math.random() * this.fallbackProducts.length)].img
      }));
    } else {
      this.displayProducts = this.fallbackProducts;
    }
  }
}

