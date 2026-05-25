import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { StorefrontComponent } from './pages/ecommerce/storefront/storefront.component';
import { AllProductsComponent } from './pages/ecommerce/all-products/all-products.component';
import { CartComponent } from './pages/ecommerce/cart/cart.component';

export const appRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: StorefrontComponent,
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'articles',
        component: AllProductsComponent,
    },
    {
        path: 'panier',
        component: CartComponent,
    },
    {
        path: '**',
        redirectTo: '',
    },
];