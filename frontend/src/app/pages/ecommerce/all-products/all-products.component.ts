import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { ShopApiService } from '../../../core/services/shop-api.service';
import { ShopCategory, ShopProduct } from '../../../core/models/shop.models';
import { ShopFooterComponent } from '../../../shared/components/footer/footer.component';
import { ShopHeaderComponent } from '../../../shared/components/header/header.component';
import { ProductDetailModalComponent } from '../../../shared/components/product-detail-modal/product-detail-modal.component';
import { ShopProductCarouselComponent } from '../../../shared/components/product-carousel/product-carousel.component';

@Component({
    selector: 'app-all-products',
    standalone: true,
    imports: [CommonModule, ShopHeaderComponent, ShopFooterComponent, ShopProductCarouselComponent, ProductDetailModalComponent],
    templateUrl: './all-products.component.html',
    styleUrls: ['./all-products.component.css'],
})
export class AllProductsComponent implements OnInit {
    products: ShopProduct[] = [];
    categories: ShopCategory[] = [];
    filteredProducts: ShopProduct[] = [];
    selectedProduct: ShopProduct | null = null;
    pageSize = 8;
    loading = true;
    query = '';
    selectedCategoryId: number | null = null;
    errorMessage: string | null = null;

    constructor(
        private readonly shopApi: ShopApiService,
        private readonly cartService: CartService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
    ) {}

    ngOnInit(): void {
        this.route.queryParamMap.subscribe((params) => {
            this.query = (params.get('q') ?? '').trim().toLowerCase();
            const categoryParam = params.get('categorie');
            this.selectedCategoryId = categoryParam ? Number(categoryParam) : null;
            this.refreshFilteredProducts();
        });

        this.shopApi.getProducts().subscribe({
            next: (products) => {
                this.products = products;
                this.loading = false;
                this.refreshFilteredProducts();
            },
            error: () => {
                this.loading = false;
                this.errorMessage = 'Impossible de charger les articles pour le moment.';
            },
        });

        this.shopApi.getCategories().subscribe({
            next: (categories) => (this.categories = categories),
            error: () => (this.categories = []),
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
        this.addToCart(event);
        void this.router.navigate(['/panier']);
    }

    setPageSize(value: string | number): void {
        this.pageSize = Math.max(1, Number(value));
    }

    selectCategory(categoryId: number | null): void {
        void this.router.navigate(['/articles'], {
            queryParams: {
                q: this.query || null,
                categorie: categoryId ?? null,
            },
        });
    }

    clearFilters(): void {
        void this.router.navigate(['/articles']);
    }

    private refreshFilteredProducts(): void {
        const normalizedQuery = this.query;
        this.filteredProducts = this.products.filter((product) => {
            const matchesCategory = !this.selectedCategoryId || product.categoryId === this.selectedCategoryId;
            const matchesQuery =
                !normalizedQuery ||
                [product.name, product.description, product.categoryName, product.brand, product.team]
                    .filter(Boolean)
                    .some((value) => value?.toLowerCase().includes(normalizedQuery));

            return matchesCategory && matchesQuery;
        });
    }
}