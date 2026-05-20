import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-shop-header',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule],
  template: `
    <!-- Top banner -->
    <div class="bg-gray-100 text-xs py-2 px-6 flex justify-between items-center text-gray-500 hidden md:flex">
      <div class="flex items-center gap-2">
        <i class="pi pi-mobile font-bold"></i>
        <span>Download BeliBeli App</span>
      </div>
      <div class="flex gap-4">
        <a href="#" class="hover:text-gray-900">Mitra BeliBeli</a>
        <a href="#" class="hover:text-gray-900">About BeliBeli</a>
        <a href="#" class="hover:text-gray-900">BeliBeli Care</a>
        <a href="#" class="hover:text-gray-900">Promo</a>
        <span class="text-gray-300">|</span>
        <a href="#" class="font-semibold text-gray-800 hover:text-black">Sign Up</a>
        <a href="#" class="font-semibold text-gray-800 hover:text-black">Login</a>
      </div>
    </div>

    <!-- Main Header -->
    <div class="py-4 px-6 flex items-center justify-between bg-white shadow-sm sticky top-0 z-50">
      <!-- Logo -->
      <div class="flex items-center gap-2 cursor-pointer">
        <div class="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xl italic">
          B
        </div>
        <span class="text-2xl font-bold tracking-tight">BeliBeli.com</span>
      </div>

      <!-- Search Bar -->
      <div class="flex-grow max-w-2xl mx-8 hidden lg:flex border border-gray-300 rounded-full overflow-hidden bg-gray-50 focus-within:ring-1 focus-within:ring-black">
        <div class="px-4 py-2 border-r border-gray-300 bg-white flex items-center min-w-max text-sm text-gray-700 font-medium whitespace-nowrap cursor-pointer">
          All Category <i class="pi pi-angle-down ml-2"></i>
        </div>
        <div class="flex flex-grow items-center px-4 bg-white">
          <i class="pi pi-search text-gray-400"></i>
          <input type="text" placeholder="Search product or brand here..." class="w-full py-2 px-3 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400" />
        </div>
      </div>

      <!-- Icons -->
      <div class="flex items-center gap-6 text-gray-600">
        <button class="relative hover:text-black transition-colors">
          <i class="pi pi-shopping-bag text-2xl"></i>
        </button>
        <button class="relative hover:text-black transition-colors">
          <i class="pi pi-bell text-2xl"></i>
          <span class="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </div>
  `
})
export class ShopHeaderComponent {}
