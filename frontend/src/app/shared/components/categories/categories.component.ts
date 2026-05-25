import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShopCategory } from '../../../core/models/shop.models';

@Component({
    selector: 'app-shop-categories',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css'],
})
export class ShopCategoriesComponent {
    @Input() categories: ShopCategory[] = [];
}
