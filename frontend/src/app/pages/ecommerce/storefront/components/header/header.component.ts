import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-shop-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
})
export class ShopHeaderComponent {
    headerLinks = ['CLOTHING', 'ACCESSORIES', 'HOME DECOR', 'COLLECTIONS', 'NEW ARRIVALS', 'SALES'];
}