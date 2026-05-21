import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { StorefrontComponent } from './pages/ecommerce/storefront/storefront.component';

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
        path: '**',
        redirectTo: '',
    },
];