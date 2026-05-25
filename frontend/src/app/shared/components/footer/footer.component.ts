import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';

const FOOTER_LINK_GROUPS = [
    {
        title: 'Femmes',
        links: ['Dernières nouveautés', 'T-shirts & hauts', 'Sweats & hoodies'],
    },
    {
        title: 'Hommes',
        links: ['Dernières nouveautés', 'T-shirts & hauts', 'Sweats & hoodies'],
    },
    {
        title: 'Accessoires',
        links: ['Sacs tote', 'Sacs à dos', 'Casquettes', 'Chaussettes'],
    },
    {
        title: 'Collections',
        links: ['KEMET', 'Diaspora', 'Power to the People', 'Afro Artists'],
    },
    {
        title: 'Infos',
        links: ['Notre histoire', 'Nous contacter', 'Livraison'],
    },
];

@Component({
    selector: 'app-shop-footer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
})
export class ShopFooterComponent {
    footerGroups = FOOTER_LINK_GROUPS;
    countries = ['Côte d\'Ivoire'];
    currencies = ['FCFA'];
}
