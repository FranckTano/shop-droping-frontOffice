import { Component } from '@angular/core';

import { ShopHeaderComponent } from './components/header/header.component';
import { ShopHeroComponent } from './components/hero/hero.component';
import { ShopCategoriesComponent } from './components/categories/categories.component';
import { ShopProductCarouselComponent } from './components/product-carousel/product-carousel.component';
import { BlackLandBannerComponent } from './components/black-land-banner/black-land-banner.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { ShopFooterComponent } from './components/footer/footer.component';

import { MEN_PRODUCTS, TOTE_PRODUCTS } from './storefront-content';

@Component({
    selector: 'app-storefront',
    standalone: true,
    imports: [
        ShopHeaderComponent,
        ShopHeroComponent,
        ShopCategoriesComponent,
        ShopProductCarouselComponent,
        BlackLandBannerComponent,
        NewsletterComponent,
        ShopFooterComponent,
    ],
    templateUrl: './storefront.component.html',
})
export class StorefrontComponent {
    readonly mensTitle = "LATEST MEN'S";
    readonly toteTitle = 'LATEST TOTE + BAGS + BACKPACKS';

    readonly mensProducts = MEN_PRODUCTS;
    readonly toteProducts = TOTE_PRODUCTS;
}
