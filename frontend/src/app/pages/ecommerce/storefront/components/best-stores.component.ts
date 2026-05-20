import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-best-stores',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 py-10 max-w-7xl mx-auto mb-10">
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-10">Best Selling Store</h2>
      
      <div class="flex flex-col lg:flex-row gap-6">
        
        <!-- Left Hero Store Banner -->
        <div class="lg:w-1/3 bg-gray-200 rounded-2xl overflow-hidden relative flex flex-col justify-end min-h-[400px]">
          <div class="absolute inset-0 pb-32">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800" alt="BeliBeli Mall" class="w-full h-full object-cover mix-blend-multiply opacity-80" />
          </div>
          <div class="relative z-10 p-8 bg-gradient-to-t from-gray-300 via-gray-200 to-transparent">
            <h3 class="text-3xl font-extrabold text-gray-900 mb-2">BeliBeli Mall</h3>
            <p class="text-gray-700 font-medium leading-tight">Shop, Explore, Delight and<br/>Experience Mall Magic!</p>
          </div>
        </div>

        <!-- Right Store Grid -->
        <div class="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div class="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow" *ngFor="let store of stores">
            <!-- Store Header -->
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg relative">
                {{ store.initial }}
                <div class="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center border border-white text-[8px] text-white">
                  <i class="pi pi-check"></i>
                </div>
              </div>
              <div>
                <h4 class="font-bold text-gray-900 leading-tight">{{ store.name }}</h4>
                <p class="text-xs text-gray-500 italic">{{ store.slogan }}</p>
              </div>
            </div>
            
            <!-- Products Subgrid -->
            <div class="grid grid-cols-3 gap-3">
              <div *ngFor="let p of store.products" class="flex flex-col items-center">
                <div class="w-full aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                  <img [src]="p.img" alt="Product" class="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <span class="text-xs font-bold text-gray-900">Rp{{ p.price }}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `
})
export class ShopBestStoresComponent {
  stores = [
    {
      name: 'Nike Sae Mall', initial: 'N',  slogan: '"Just do it bro!"',
      products: [
        { price: '650.000', img: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=200' },
        { price: '270.000', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=200' },
        { price: '99.000', img: 'https://images.unsplash.com/photo-1580975608826-bb212675de6f?auto=format&fit=crop&q=80&w=200' }
      ]
    },
    {
      name: 'Barudak Disaster Mall', initial: 'B', slogan: '"Unleash Your Fashion"',
      products: [
        { price: '324.000', img: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=200' },
        { price: '199.000', img: 'https://images.unsplash.com/photo-1614252339474-d071b647493e?auto=format&fit=crop&q=80&w=200' },
        { price: '120.000', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200' }
      ]
    },
    {
      name: 'Galaxy Galleria Mall', initial: 'G', slogan: '"Be Extraordinary"',
      products: [
        { price: '179.000', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=200' },
        { price: '199.000', img: 'https://images.unsplash.com/photo-1614252235316-8c8577319c5c?auto=format&fit=crop&q=80&w=200' },
        { price: '253.000', img: 'https://images.unsplash.com/photo-1542272604-780c8d55fa4f?auto=format&fit=crop&q=80&w=200' }
      ]
    },
    {
      name: 'Aurora Well Mall', initial: 'A', slogan: '"Chic, Bold, Confident"',
      products: [
        { price: '250.000', img: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=200' },
        { price: '162.000', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=200' },
        { price: '255.000', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=200' }
      ]
    }
  ];
}
