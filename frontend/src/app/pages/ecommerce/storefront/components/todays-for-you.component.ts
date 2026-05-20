import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produit } from '@services/produit.service';

@Component({
  selector: 'app-shop-todays-foryou',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 py-10 max-w-7xl mx-auto">
      
      <!-- Header & Filters -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h2 class="text-2xl font-bold text-gray-900">Todays For You!</h2>
        
        <div class="flex flex-wrap gap-2">
          <button class="px-5 py-2.5 rounded-full text-sm font-semibold transition-colors bg-black text-white hover:bg-gray-800">Best Seller</button>
          <button class="px-5 py-2.5 rounded-full text-sm font-semibold transition-colors bg-white text-gray-700 border border-gray-200 hover:bg-gray-50">Keep Stylish</button>
          <button class="px-5 py-2.5 rounded-full text-sm font-semibold transition-colors bg-white text-gray-700 border border-gray-200 hover:bg-gray-50">Special Discount</button>
          <button class="px-5 py-2.5 rounded-full text-sm font-semibold transition-colors bg-white text-gray-700 border border-gray-200 hover:bg-gray-50">Official Store</button>
          <button class="px-5 py-2.5 rounded-full text-sm font-semibold transition-colors bg-white text-gray-700 border border-gray-200 hover:bg-gray-50">Coveted Product</button>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        <div class="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all border border-gray-100 group relative" *ngFor="let p of displayProducts">
          <button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:text-red-500">
            <i class="pi" [ngClass]="p.liked ? 'pi-heart-fill text-red-500' : 'pi-heart'"></i>
          </button>
          
          <div class="bg-gray-100 h-60 m-2 rounded-lg flex items-center justify-center overflow-hidden">
            <img [src]="p.img" alt="product image" class="w-full h-full object-cover mix-blend-multiply" *ngIf="p.img" />
          </div>
          
          <div class="px-4 pb-5 pt-2">
            <h3 class="font-bold text-gray-900 text-sm leading-tight h-10 line-clamp-2 mb-2">{{ p.name }}</h3>
            
            <div class="flex items-center gap-2 mb-2 text-xs">
              <div class="flex items-center text-yellow-400">
                <i class="pi pi-star-fill text-[10px]"></i>
                <span class="text-gray-700 font-medium ml-1">{{ p.rating }}</span>
              </div>
              <span class="text-gray-300">•</span>
              <span class="text-gray-500">{{ p.sold }} Sold</span>
            </div>
            
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold text-black">{{ p.price | currency:'EUR':'symbol' }}</span>
              <span class="text-xs text-gray-400 line-through" *ngIf="p.originalPrice">{{ p.originalPrice | currency:'EUR':'symbol' }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class ShopTodaysForyouComponent implements OnChanges {
  @Input() produits: Produit[] = [];
  displayProducts: any[] = [];
  
  fallbackProducts = [
    { name: "UrbanEdge Men's Jeans Collection", price: 253.000, originalPrice: 370.000, rating: 4.9, sold: "10K+", img: 'https://images.unsplash.com/photo-1542272604-780c8d55fa4f?auto=format&fit=crop&q=80&w=400', liked: false },
    { name: "Essentials Men's Long-Sleeve Oxford Shirt", price: 179.000, rating: 4.9, sold: "10K+", img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400', liked: false },
    { name: "StyleHaven Men's Fashionable Brogues", price: 199.000, originalPrice: 325.000, rating: 4.9, sold: "8K+", img: 'https://images.unsplash.com/photo-1614252235316-8c8577319c5c?auto=format&fit=crop&q=80&w=400', liked: true },
    { name: "Essential Long-Sleeve Crewneck Shirt for Men", price: 120.000, rating: 4.9, sold: "5K+", img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400', liked: false },
    { name: "ClassicGent Men's Formal Shoes", price: 199.000, rating: 4.9, sold: "4K+", img: 'https://images.unsplash.com/photo-1614252339474-d071b647493e?auto=format&fit=crop&q=80&w=400', liked: false },
    { name: "UrbanFlex Men's Short Pants Collection", price: 162.000, rating: 4.9, sold: "2K+", img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=400', liked: true },
    { name: "ChicCarry - Elegant Women's Tote Collection", price: 650.000, rating: 4.9, sold: "500+", img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=400', liked: false },
    { name: "Sophisticated Women's Parka Line", price: 324.000, originalPrice: 650.000, rating: 4.9, sold: "100+", img: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=400', liked: false }
  ];

  ngOnChanges() {
    if (this.produits && this.produits.length > 0) {
      this.displayProducts = this.produits.map(p => ({
        name: p.nom,
        price: p.prix,
        originalPrice: p.prix * 1.2,
        rating: 4.9,
        sold: Math.floor(Math.random() * 50) + 'K+',
        img: p.imageUrl || this.fallbackProducts[Math.floor(Math.random() * this.fallbackProducts.length)].img,
        liked: Math.random() > 0.7
      }));
    } else {
      this.displayProducts = this.fallbackProducts;
    }
  }
}

