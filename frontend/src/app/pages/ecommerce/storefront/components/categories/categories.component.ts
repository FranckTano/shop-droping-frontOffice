import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CATEGORY_ITEMS } from '../../storefront-content';

@Component({
    selector: 'app-shop-categories',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './categories.component.html',
})
export class ShopCategoriesComponent {
    categories = CATEGORY_ITEMS;
}