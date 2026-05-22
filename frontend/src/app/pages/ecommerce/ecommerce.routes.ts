import { Routes } from '@angular/router';
import { BoutiqueLayout } from '@/layout/boutique/boutique-layout';

export default [
    {
        path: '',
        component: BoutiqueLayout,
        children: [
            {
                path: '',
                data: { breadcrumb: 'Boutique' },
                loadComponent: () => import('./productlist').then((c) => c.ProductListComponent)
            },
            {
                path: 'product-overview/:id',
                data: { breadcrumb: 'Détail Produit' },
                loadComponent: () => import('./productoverview').then((c) => c.ProductOverviewComponent)
            },
            {
                path: 'panier',
                data: { breadcrumb: 'Panier' },
                loadComponent: () => import('./shoppingcart.component').then((c) => c.ShoppingCartComponent)
            },
        ]
    }
] as Routes;
