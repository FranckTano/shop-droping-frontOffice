import { Injectable, computed, effect, signal } from '@angular/core';

import { CartLine, CartLineDraft, ShopProduct } from '../models/shop.models';

@Injectable({ providedIn: 'root' })
export class CartService {
    private readonly storageKey = 'shop-dropping-cart-v1';
    private readonly itemsSignal = signal<CartLine[]>(this.readStorage());

    readonly items = this.itemsSignal.asReadonly();
    readonly totalQuantity = computed(() => this.itemsSignal().reduce((total, item) => total + item.quantity, 0));
    readonly count = this.totalQuantity;

    constructor() {
        effect(() => {
            window.localStorage.setItem(this.storageKey, JSON.stringify(this.itemsSignal()));
        });
    }

    add(product: ShopProduct, draft: CartLineDraft = {}): void {
        const quantity = Math.max(1, Number(draft.quantity || 1));
        const size = draft.size ?? null;
        const color = draft.color ?? null;
        const existingItems = [...this.itemsSignal()];
        const itemIndex = existingItems.findIndex((item) => this.matches(item, product.id, size, color));

        if (itemIndex >= 0) {
            existingItems[itemIndex] = {
                ...existingItems[itemIndex],
                quantity: existingItems[itemIndex].quantity + quantity,
            };
        } else {
            existingItems.push({
                productId: product.id,
                quantity,
                size,
                color,
            });
        }

        this.itemsSignal.set(existingItems);
    }

    setQuantity(productId: number, quantity: number, size: string | null = null, color: string | null = null): void {
        const normalizedQuantity = Math.max(1, Number(quantity || 1));
        this.itemsSignal.update((items) =>
            items.map((item) => (this.matches(item, productId, size, color) ? { ...item, quantity: normalizedQuantity } : item)),
        );
    }

    remove(productId: number, size: string | null = null, color: string | null = null): void {
        this.itemsSignal.update((items) => items.filter((item) => !this.matches(item, productId, size, color)));
    }

    clear(): void {
        this.itemsSignal.set([]);
    }

    private matches(item: CartLine, productId: number, size: string | null, color: string | null): boolean {
        return item.productId === productId && item.size === size && item.color === color;
    }

    private readStorage(): CartLine[] {
        if (typeof window === 'undefined') {
            return [];
        }

        try {
            const rawValue = window.localStorage.getItem(this.storageKey);
            return rawValue ? (JSON.parse(rawValue) as CartLine[]) : [];
        } catch {
            return [];
        }
    }
}