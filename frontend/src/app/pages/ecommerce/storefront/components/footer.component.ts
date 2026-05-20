import { Component } from '@angular/core';

@Component({
  selector: 'app-shop-footer',
  standalone: true,
  template: `
    <footer class="bg-[#1C202B] text-white">
      <!-- Call to Action Banner -->
      <div class="h-64 relative flex items-center justify-center bg-gray-500 overflow-hidden mix-blend-overlay">
        <!-- Background image -->
        <img src="https://images.unsplash.com/photo-1558769132-cb1fac0840c2?auto=format&fit=crop&q=80&w=1200" alt="Clothes rack" class="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply" />
        <h2 class="relative z-10 text-4xl md:text-5xl font-extrabold italic text-white text-center shadow-sm">
          "Let's Shop Beyond Boundaries"
        </h2>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-16">
        <div class="flex flex-col md:flex-row justify-between gap-10">
          
          <div class="max-w-xs">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 border border-white text-white rounded-lg flex items-center justify-center font-bold text-xl italic bg-transparent">
                B
              </div>
              <span class="text-2xl font-bold tracking-tight">BeliBeli.com</span>
            </div>
            <p class="text-gray-400 font-semibold mb-6">"Let's Shop Beyond Boundaries"</p>
            
            <div class="flex gap-4 text-xl text-gray-400">
              <a href="#" class="hover:text-white"><i class="pi pi-facebook"></i></a>
              <a href="#" class="hover:text-white"><i class="pi pi-twitter"></i></a>
              <a href="#" class="hover:text-white"><i class="pi pi-youtube"></i></a>
              <a href="#" class="hover:text-white"><i class="pi pi-instagram"></i></a>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-x-16 gap-y-8">
            <div class="flex flex-col gap-3">
              <h4 class="font-bold text-lg mb-2">BeliBeli</h4>
              <a href="#" class="text-gray-400 hover:text-white text-sm font-medium">About BeliBeli</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm font-medium">Career</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm font-medium">Mitra Blog</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm font-medium">B2B Digital</a>
            </div>
            
            <div class="flex flex-col gap-3">
              <h4 class="font-bold text-lg mb-2">Buy</h4>
              <a href="#" class="text-gray-400 hover:text-white text-sm font-medium">Bill & Top Up</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm font-medium">BeliBeli COD</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm font-medium">Mitra Blog</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm font-medium">Promo</a>
            </div>
            
            <div class="flex flex-col gap-3">
              <h4 class="font-bold text-lg mb-2">Sell</h4>
              <a href="#" class="text-gray-400 hover:text-white text-sm font-medium">Seller Education Center</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm font-medium">Brand Index</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm font-medium">Register Official Store</a>
            </div>
            
            <div class="flex flex-col gap-3">
              <h4 class="font-bold text-lg mb-2">Guide and Help</h4>
              <a href="#" class="text-gray-400 hover:text-white text-sm font-medium">BeliBeli Care</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm font-medium">Term and Condition</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm font-medium">Privacy</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm font-medium">Mitra</a>
            </div>
          </div>
          
        </div>

        <div class="mt-16 pt-8 border-t border-gray-700 text-center text-gray-400 text-xs font-medium">
          © 2001 - 2026, BeliBeli.com
        </div>
      </div>
    </footer>
  `
})
export class ShopFooterComponent {}
