import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShopProduct } from '../../../core/models/shop.models';

@Component({
    selector: 'app-shop-product-carousel',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-carousel.component.html',
    styleUrls: ['./product-carousel.component.css'],
})
export class ShopProductCarouselComponent implements OnChanges {
    @Input() title = '';
    @Input() showAll = true;
    @Input() showAllLink = '/articles';
    @Input() products: ShopProduct[] = [];
    @Input() pagination = true;
    @Input() pageSize = 8;
    @Input() background: string | null = null;
    @Input() showPageSizeSelector = true;

    @Output() productSelected = new EventEmitter<ShopProduct>();
    @Output() addToCart = new EventEmitter<{ product: ShopProduct; quantity: number; size: string | null; color: string | null }>();
    @Output() pageSizeChange = new EventEmitter<number>();

    readonly pageSizeOptions = [8, 12, 16, 20, 24];

    currentPage = 1;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['pageSize'] && !changes['pageSize'].firstChange) {
            this.currentPage = 1;
        }

        if (changes['products']) {
            this.currentPage = Math.min(this.currentPage, this.pageCount);
        }
    }

    trackById(index: number, product: ShopProduct) {
        return product.id;
    }

    get visibleProducts(): ShopProduct[] {
        const size = Math.max(1, this.pageSize);
        const startIndex = (this.currentPage - 1) * size;
        return this.products.slice(startIndex, startIndex + size);
    }

    get pageCount(): number {
        return Math.max(1, Math.ceil(this.products.length / Math.max(1, this.pageSize)));
    }

    get canGoPrevious(): boolean {
        return this.currentPage > 1;
    }

    get canGoNext(): boolean {
        return this.currentPage < this.pageCount;
    }

    selectProduct(product: ShopProduct): void {
        this.productSelected.emit(product);
    }

    setPageSize(value: string | number): void {
        const nextPageSize = Math.max(1, Number(value));
        this.pageSize = nextPageSize;
        this.currentPage = 1;
        this.pageSizeChange.emit(nextPageSize);
    }

    previousPage(): void {
        if (this.canGoPrevious) {
            this.currentPage -= 1;
        }
    }

    nextPage(): void {
        if (this.canGoNext) {
            this.currentPage += 1;
        }
    }

    quickAdd(product: ShopProduct, event: MouseEvent): void {
        event.stopPropagation();

        this.addToCart.emit({
            product,
            quantity: 1,
            size: product.sizes.find((size) => size.inStock)?.size ?? product.sizes[0]?.size ?? null,
            color: product.colors[0] ?? null,
        });
    }
}
