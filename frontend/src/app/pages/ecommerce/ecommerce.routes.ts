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
            {
                path: 'coming-soon',
                data: { breadcrumb: 'En développement' },
                loadComponent: () => import('./coming-soon').then((c) => c.ComingSoonComponent)
            },
            {
                path: 'ma-commande',
                data: { breadcrumb: 'Suivi de commande' },
                loadComponent: () => import('./suivi-commande').then((c) => c.SuiviCommandeComponent)
            },
            {
                path: 'paiement-retour',
                data: { breadcrumb: 'Confirmation paiement' },
                loadComponent: () => import('./paiement-retour').then((c) => c.PaiementRetourComponent)
            },
        ]
    }
] as Routes;
