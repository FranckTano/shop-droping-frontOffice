import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
    BackendCategoryDto,
    BackendProductDto,
    CheckoutRequest,
    SearchSuggestion,
    ShopCategory,
    ShopProduct,
    ShopProductSize,
} from '../models/shop.models';

@Injectable({ providedIn: 'root' })
export class ShopApiService {
    private readonly http = inject(HttpClient);
    private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/+$/, '');
    private readonly mediaBaseUrl = environment.mediaBaseUrl.replace(/\/+$/, '');

    getProducts(): Observable<ShopProduct[]> {
        return this.http
            .get<BackendProductDto[]>(`${this.apiBaseUrl}/produits`)
            .pipe(map((products) => products.map((product) => this.toProduct(product))));
    }

    getProductById(id: number): Observable<ShopProduct> {
        return this.http
            .get<BackendProductDto>(`${this.apiBaseUrl}/produits/${id}`)
            .pipe(map((product) => this.toProduct(product)));
    }

    getProductsByCategory(categoryId: number): Observable<ShopProduct[]> {
        return this.http
            .get<BackendProductDto[]>(`${this.apiBaseUrl}/produits/categorie/${categoryId}`)
            .pipe(map((products) => products.map((product) => this.toProduct(product))));
    }

    getFeaturedProducts(limit = 8): Observable<ShopProduct[]> {
        return this.getProducts().pipe(
            map((products) => [...products].sort((left, right) => Number(right.isNew) - Number(left.isNew) || Number(right.onSale) - Number(left.onSale) || right.stockTotal - left.stockTotal).slice(0, limit)),
        );
    }

    getPromotions(limit = 8): Observable<ShopProduct[]> {
        return this.http
            .get<BackendProductDto[]>(`${this.apiBaseUrl}/produits/promotions`)
            .pipe(map((products) => products.map((product) => this.toProduct(product)).slice(0, limit)));
    }

    getNewArrivals(limit = 8): Observable<ShopProduct[]> {
        return this.http
            .get<BackendProductDto[]>(`${this.apiBaseUrl}/produits/nouveautes`)
            .pipe(map((products) => products.map((product) => this.toProduct(product)).slice(0, limit)));
    }

    searchProducts(term: string): Observable<SearchSuggestion[]> {
        const normalizedTerm = term.trim();

        if (!normalizedTerm) {
            return of([]);
        }

        return this.http
            .get<BackendProductDto[]>(`${this.apiBaseUrl}/produits/recherche`, {
                params: { terme: normalizedTerm },
            })
            .pipe(
                map((products) =>
                    products.map((product) => {
                        const mappedProduct = this.toProduct(product);

                        return {
                            product: mappedProduct,
                            label: [mappedProduct.categoryName, this.formatMoney(mappedProduct.effectivePrice)]
                                .filter(Boolean)
                                .join(' • '),
                        };
                    }),
                ),
            );
    }

    getCategories(): Observable<ShopCategory[]> {
        return this.http
            .get<BackendCategoryDto[]>(`${this.apiBaseUrl}/categories`)
            .pipe(map((categories) => categories.map((category) => this.toCategory(category))));
    }

    createOrder(request: CheckoutRequest): Observable<unknown> {
        return this.http.post(`${this.apiBaseUrl}/commandes`, request);
    }

    resolveMediaUrl(path: string | null | undefined): string {
        if (!path) {
            return '';
        }

        if (/^https?:\/\//i.test(path) || path.startsWith('data:')) {
            return path;
        }

        if (path.startsWith('/assets/') || path.startsWith('assets/')) {
            return path.startsWith('/') ? path : `/${path}`;
        }

        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${this.mediaBaseUrl}${normalizedPath}`;
    }

    formatMoney(amount: number | string | null | undefined): string {
        const numericValue = Number(amount ?? 0);
        return `${new Intl.NumberFormat('fr-CI', { maximumFractionDigits: 0 }).format(numericValue)} FCFA`;
    }

    private toProduct(product: BackendProductDto): ShopProduct {
        const galleryUrls = (product.images ?? []).map((imageUrl) => this.resolveMediaUrl(imageUrl));
        const primaryImageUrl = this.resolveMediaUrl(product.imagePrincipale ?? galleryUrls[0] ?? '');

        return {
            id: Number(product.id),
            name: product.nom,
            description: product.description ?? 'Aucune description disponible pour le moment.',
            price: Number(product.prix ?? 0),
            salePrice: product.prixPromo !== null && product.prixPromo !== undefined ? Number(product.prixPromo) : null,
            effectivePrice: Number(product.prixEffectif ?? product.prix ?? 0),
            primaryImageUrl,
            active: Boolean(product.actif),
            onSale: Boolean(product.enPromotion),
            isNew: Boolean(product.nouveau),
            team: product.equipe ?? null,
            season: product.saison ?? null,
            brand: product.marque ?? null,
            colors: product.couleursDisponibles ?? [],
            categoryId: product.categorieId !== null && product.categorieId !== undefined ? Number(product.categorieId) : null,
            categoryName: product.categorieNom ?? null,
            galleryUrls,
            sizes: (product.tailles ?? []).map((size) => this.toSize(size)),
            stockTotal: Number(product.stockTotal ?? 0),
            inStock: Boolean(product.enStock),
        };
    }

    private toSize(size: { id: number; taille: string; stock: number; enStock: boolean }): ShopProductSize {
        return {
            id: Number(size.id),
            size: size.taille,
            stock: Number(size.stock ?? 0),
            inStock: Boolean(size.enStock),
        };
    }

    private toCategory(category: BackendCategoryDto): ShopCategory {
        return {
            id: Number(category.id),
            name: category.nom,
            description: category.description ?? '',
            imageUrl: this.resolveMediaUrl(category.imageUrl),
            active: Boolean(category.actif),
            productCount: Number(category.nombreProduits ?? 0),
        };
    }
}