import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 py-8 max-w-7xl mx-auto">
      <div class="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4">
        
        <div *ngFor="let cat of categories" class="flex flex-col items-center gap-3 cursor-pointer group">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center p-3 transition-transform group-hover:scale-110 shadow-sm border border-gray-100">
            <!-- Replace with actual images or icons. We use pi icons or generic placeholder shapes -->
            <img [src]="cat.img" [alt]="cat.name" class="w-full h-full object-contain pointer-events-none" *ngIf="cat.img" />
            <i [class]="cat.icon" class="text-2xl text-gray-700" *ngIf="!cat.img"></i>
          </div>
          <span class="text-xs font-semibold text-gray-700 group-hover:text-black">{{ cat.name }}</span>
        </div>

      </div>
    </div>
  `
})
export class ShopCategoriesComponent {
  categories: { name: string, icon: string, img?: string }[] = [
    { name: 'T-Shirt', icon: 'pi pi-user' }, // placeholders
    { name: 'Jacket', icon: 'pi pi-cloud' },
    { name: 'Shirt', icon: 'pi pi-book' },
    { name: 'Jeans', icon: 'pi pi-stop' },
    { name: 'Bag', icon: 'pi pi-shopping-bag' },
    { name: 'Shoes', icon: 'pi pi-send' },
    { name: 'Watches', icon: 'pi pi-clock' },
    { name: 'Cap', icon: 'pi pi-sun' },
    { name: 'All Category', icon: 'pi pi-th-large' },
  ];
}
