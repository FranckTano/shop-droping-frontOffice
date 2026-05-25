import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SearchSuggestion } from '../../../core/models/shop.models';
import { CartService } from '../../../core/services/cart.service';
import { ShopApiService } from '../../../core/services/shop-api.service';

@Component({
    selector: 'app-shop-header',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class ShopHeaderComponent implements AfterViewInit {
    @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

    searchTerm = '';
    previousSearchTerm = '';
    isSearchFocused = false;
    isSelectingSuggestion = false;
    searchResults: SearchSuggestion[] = [];

    private readonly destroyRef = inject(DestroyRef);
    private readonly searchTerm$ = new Subject<string>();

    constructor(
        public readonly cartService: CartService,
        private readonly shopApi: ShopApiService,
        private readonly router: Router,
    ) {
        this.searchTerm$
            .pipe(
                debounceTime(180),
                distinctUntilChanged(),
                switchMap((term) => this.shopApi.searchProducts(term)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((results) => {
                this.searchResults = results;
            });
    }

    ngAfterViewInit(): void {
        this.syncHeaderHeight();

        if (this.previousSearchTerm) {
            this.searchTerm$.next(this.previousSearchTerm);
        }
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        this.syncHeaderHeight();
    }

    submitSearch(): void {
        void this.router.navigate(['/articles'], {
            queryParams: this.searchTerm.trim() ? { q: this.searchTerm.trim() } : {},
        });
    }

    onSearchInput(value: string): void {
        this.searchTerm = value;
        this.searchTerm$.next(value);
    }

    onSearchFocus(): void {
        this.isSearchFocused = true;

        if (!this.searchTerm && this.previousSearchTerm) {
            this.searchTerm = this.previousSearchTerm;
        }

        queueMicrotask(() => {
            const inputElement = this.searchInput?.nativeElement;
            if (inputElement) {
                inputElement.setSelectionRange(0, inputElement.value.length);
            }
        });

        if (this.previousSearchTerm) {
            this.searchTerm$.next(this.previousSearchTerm);
        }
    }

    onSearchBlur(): void {
        if (this.isSelectingSuggestion) {
            this.isSelectingSuggestion = false;
            this.isSearchFocused = false;
            return;
        }

        this.isSearchFocused = false;
        this.previousSearchTerm = this.searchTerm.trim();
        this.searchTerm = '';
    }

    openSuggestion(suggestion: SearchSuggestion, event: MouseEvent): void {
        event.preventDefault();
        this.isSelectingSuggestion = true;
        this.previousSearchTerm = suggestion.product.name;
        this.searchTerm = '';
        this.isSearchFocused = false;

        void this.router.navigate(['/articles'], {
            queryParams: { q: suggestion.product.name },
        });
    }

    get showSearchDropdown(): boolean {
        return this.isSearchFocused && this.searchResults.length > 0;
    }

    private syncHeaderHeight(): void {
        queueMicrotask(() => {
            const headerHeight = this.searchInput?.nativeElement?.closest('header')?.clientHeight ?? 0;
            if (headerHeight > 0) {
                document.documentElement.style.setProperty('--shop-header-height', `${headerHeight}px`);
            }
        });
    }
}
