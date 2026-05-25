import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { ShopApiService } from '../../../core/services/shop-api.service';
import { ShopCategory, ShopProduct } from '../../../core/models/shop.models';
import { ShopHeaderComponent } from '../../../shared/components/header/header.component';
import { ShopHeroComponent } from '../../../shared/components/hero/hero.component';
import { ShopProductCarouselComponent } from '../../../shared/components/product-carousel/product-carousel.component';
import { BlackLandBannerComponent } from '../../../shared/components/black-land-banner/black-land-banner.component';
import { NewsletterComponent } from '../../../shared/components/newsletter/newsletter.component';
import { ShopFooterComponent } from '../../../shared/components/footer/footer.component';
import { ProductDetailModalComponent } from '../../../shared/components/product-detail-modal/product-detail-modal.component';

@Component({
    selector: 'app-storefront',
    standalone: true,
    imports: [
        CommonModule,
        ShopHeaderComponent,
        ShopHeroComponent,
        ShopProductCarouselComponent,
        BlackLandBannerComponent,
        NewsletterComponent,
        ShopFooterComponent,
        ProductDetailModalComponent,
    ],
    templateUrl: './storefront.component.html',
    styleUrls: ['./storefront.component.css'],
})
export class StorefrontComponent implements OnInit {
    readonly featuredTitle = 'Sélection du moment';
    readonly promotionsTitle = 'Promotions';
    readonly newArrivalsTitle = 'Nouveautés';

    categories: ShopCategory[] = [];
    featuredProducts: ShopProduct[] = [];
    promotions: ShopProduct[] = [];
    newArrivals: ShopProduct[] = [];
    selectedProduct: ShopProduct | null = null;
    loading = true;
    errorMessage: string | null = null;

    constructor(
        private readonly shopApi: ShopApiService,
        private readonly cartService: CartService,
        private readonly router: Router,
    ) {}

    ngOnInit(): void {
        this.shopApi.getCategories().subscribe({
            next: (categories) => (this.categories = categories),
            error: () => (this.categories = []),
        });

        this.shopApi.getFeaturedProducts().subscribe({
            next: (products) => {
                this.featuredProducts = products;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.errorMessage = 'Impossible de charger les articles pour le moment.';
            },
        });

        this.shopApi.getPromotions().subscribe({
            next: (products) => (this.promotions = products),
            error: () => (this.promotions = []),
        });

        this.shopApi.getNewArrivals().subscribe({
            next: (products) => (this.newArrivals = products),
            error: () => (this.newArrivals = []),
        });
    }

    openProduct(product: ShopProduct): void {
        this.selectedProduct = product;
    }

    closeProduct(): void {
        this.selectedProduct = null;
    }

    addToCart(event: { product: ShopProduct; quantity: number; size: string | null; color: string | null }): void {
        this.cartService.add(event.product, event);
    }

    buyNow(event: { product: ShopProduct; quantity: number; size: string | null; color: string | null }): void {
        this.cartService.add(event.product, event);
        void this.router.navigate(['/panier']);
    }
}
