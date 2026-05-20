import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 py-6 max-w-7xl mx-auto">
      <div class="relative bg-gray-50 rounded-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between h-auto md:h-96">
        
        <!-- Background decorative blobs could go here, for simplicity we use soft background -->
        
        <div class="p-8 md:p-14 z-10 flex-1 w-full flex flex-col justify-center">
          <p class="text-gray-500 font-semibold mb-2 tracking-wide text-sm">#Big Fashion Sale</p>
          <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
            Limited Time Offer!<br />
            Up to <span class="italic font-black">50% OFF!</span>
          </h1>
          <p class="text-gray-600 text-lg mb-8">Redefine Your Everyday Style</p>
          
          <div class="flex gap-2.5 items-center">
            <span class="w-2.5 h-2.5 rounded-full bg-black block cursor-pointer"></span>
            <span class="w-2 h-2 rounded-full bg-gray-300 block cursor-pointer hover:bg-gray-400"></span>
            <span class="w-2 h-2 rounded-full bg-gray-300 block cursor-pointer hover:bg-gray-400"></span>
            <span class="w-2 h-2 rounded-full bg-gray-300 block cursor-pointer hover:bg-gray-400"></span>
          </div>
        </div>

        <div class="flex-1 w-full h-full relative min-h-[300px] md:min-h-full">
          <!-- Image composite representing clothes, shoes, bag as in the mockup. 
               We will use a placeholder styling representing the apparel since we don't have the exact image assets -->
          <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1200'); opacity: 0.8; mix-blend-mode: multiply;"></div>
        </div>

      </div>
    </div>
  `
})
export class ShopHeroComponent {}
