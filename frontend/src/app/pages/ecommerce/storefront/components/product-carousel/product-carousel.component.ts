import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-shop-product-carousel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-carousel.component.html',
})
export class ShopProductCarouselComponent {
    @Input() title = '';
    @Input() showAll = true;
    @Input() products: Array<{ id: string; name: string; price: string; image: string; href: string; badge?: 'NEW' | 'SALE' }> = [];

    trackById(index: number, product: { id: string }) {
        return product.id;
    }
}