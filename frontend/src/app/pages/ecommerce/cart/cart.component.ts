import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { ShopApiService } from '../../../core/services/shop-api.service';
import { CartLineView, CheckoutRequest, ShopProduct } from '../../../core/models/shop.models';
import { ShopFooterComponent } from '../../../shared/components/footer/footer.component';
import { ShopHeaderComponent } from '../../../shared/components/header/header.component';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule, ShopHeaderComponent, ShopFooterComponent],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
    products = signal<ShopProduct[]>([]);
    cartItems = computed<CartLineView[]>(() => {
        const items = this.cartService.items();
        const catalog = this.products();

        return items
            .map((item) => {
                const product = catalog.find((entry) => entry.id === item.productId);
                if (!product) {
                    return null;
                }

                return {
                    ...item,
                    product,
                    lineTotal: product.effectivePrice * item.quantity,
                } satisfies CartLineView;
            })
            .filter((item): item is CartLineView => item !== null);
    });
    totalAmount = computed(() => this.cartItems().reduce((total, item) => total + item.lineTotal, 0));
    isSubmitting = false;
    successMessage: string | null = null;
    errorMessage: string | null = null;

    readonly checkoutForm;

    constructor(
        private readonly formBuilder: FormBuilder,
        public readonly shopApi: ShopApiService,
        private readonly cartService: CartService,
    ) {
        this.checkoutForm = this.formBuilder.group({
            clientNom: ['', Validators.required],
            clientTelephone: ['', Validators.required],
            clientEmail: ['', Validators.email],
            clientAdresse: ['', Validators.required],
            notes: [''],
        });
    }

    ngOnInit(): void {
        this.shopApi.getProducts().subscribe({
            next: (products) => this.products.set(products),
            error: () => {
                this.errorMessage = 'Impossible de charger le panier pour le moment.';
            },
        });
    }

    increaseQuantity(item: CartLineView): void {
        this.cartService.setQuantity(item.productId, item.quantity + 1, item.size, item.color);
    }

    decreaseQuantity(item: CartLineView): void {
        if (item.quantity <= 1) {
            this.cartService.remove(item.productId, item.size, item.color);
            return;
        }

        this.cartService.setQuantity(item.productId, item.quantity - 1, item.size, item.color);
    }

    removeItem(item: CartLineView): void {
        this.cartService.remove(item.productId, item.size, item.color);
    }

    submitOrder(): void {
        if (this.checkoutForm.invalid || this.cartItems().length === 0) {
            this.checkoutForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;
        this.successMessage = null;
        this.errorMessage = null;

        const request: CheckoutRequest = {
            clientNom: this.checkoutForm.value.clientNom ?? '',
            clientTelephone: this.checkoutForm.value.clientTelephone ?? '',
            clientEmail: this.checkoutForm.value.clientEmail ?? '',
            clientAdresse: this.checkoutForm.value.clientAdresse ?? '',
            notes: this.checkoutForm.value.notes ?? '',
            lignes: this.cartItems().map((item) => ({
                produitId: item.productId,
                taille: item.size,
                couleur: item.color,
                quantite: item.quantity,
                badgesOfficiels: false,
                flocage: false,
                flocageNom: null,
                flocageNumero: null,
                prixOptionsUnitaire: 0,
            })),
        };

        this.shopApi.createOrder(request).subscribe({
            next: () => {
                this.cartService.clear();
                this.checkoutForm.reset();
                this.successMessage = 'Votre commande a été enregistrée avec succès.';
                this.isSubmitting = false;
            },
            error: () => {
                this.errorMessage = 'La commande n’a pas pu être créée pour le moment.';
                this.isSubmitting = false;
            },
        });
    }
}