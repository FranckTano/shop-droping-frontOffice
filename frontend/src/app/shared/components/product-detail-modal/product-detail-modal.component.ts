import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ShopApiService } from '../../../core/services/shop-api.service';
import { ShopProduct } from '../../../core/models/shop.models';

@Component({
    selector: 'app-product-detail-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-detail-modal.component.html',
    styleUrls: ['./product-detail-modal.component.css'],
})
export class ProductDetailModalComponent implements OnChanges {
    @Input() product: ShopProduct | null = null;
    @Input() visible = false;

    @Output() close = new EventEmitter<void>();
    @Output() addToCart = new EventEmitter<{ product: ShopProduct; quantity: number; size: string | null; color: string | null }>();
    @Output() buyNow = new EventEmitter<{ product: ShopProduct; quantity: number; size: string | null; color: string | null }>();

    quantity = 1;
    selectedSize: string | null = null;
    selectedColor: string | null = null;

    constructor(protected readonly shopApi: ShopApiService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['product'] || changes['visible']) {
            this.quantity = 1;
            this.selectedSize = this.product?.sizes?.find((size) => size.inStock)?.size ?? this.product?.sizes?.[0]?.size ?? null;
            this.selectedColor = this.product?.colors?.[0] ?? null;
        }
    }

    setProduct(product: ShopProduct | null): void {
        this.product = product;
        this.quantity = 1;
        this.selectedSize = product?.sizes?.find((size) => size.inStock)?.size ?? product?.sizes?.[0]?.size ?? null;
        this.selectedColor = product?.colors?.[0] ?? null;
    }

    increaseQuantity(): void {
        this.quantity += 1;
    }

    decreaseQuantity(): void {
        this.quantity = Math.max(1, this.quantity - 1);
    }

    chooseSize(size: string): void {
        this.selectedSize = size;
    }

    chooseColor(color: string): void {
        this.selectedColor = color;
    }

    emitAddToCart(): void {
        if (!this.product) {
            return;
        }

        this.addToCart.emit({
            product: this.product,
            quantity: this.quantity,
            size: this.selectedSize,
            color: this.selectedColor,
        });
    }

    emitBuyNow(): void {
        if (!this.product) {
            return;
        }

        this.buyNow.emit({
            product: this.product,
            quantity: this.quantity,
            size: this.selectedSize,
            color: this.selectedColor,
        });
    }

    closeModal(): void {
        this.close.emit();
    }
}
