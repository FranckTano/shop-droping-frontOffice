import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class MetaService {

    private title = inject(Title);
    private meta  = inject(Meta);
    private doc   = inject(DOCUMENT);

    private readonly BASE_URL = 'https://momo-store.shop';
    private readonly DEFAULT_IMAGE = 'https://momo-store.shop/images/app/login.png';

    setBoutique(): void {
        this.title.setTitle('MOMOStore | Boutique de maillots de football');
        this.update({
            description: 'MOMOStore — Maillots de football actuels, vintage et collection en Côte d\'Ivoire. Personnalisation flocage. Livraison 2 jours max.',
            ogTitle:     'MOMOStore | Boutique de maillots de football',
            ogUrl:       `${this.BASE_URL}/boutique`,
            ogImage:     this.DEFAULT_IMAGE,
            canonical:   `${this.BASE_URL}/boutique`,
        });
    }

    setProduit(nom: string, description: string | null, image: string | null, id: number, prix: number): void {
        const desc = description
            ? description.slice(0, 155)
            : `${nom} — Maillot de football disponible sur MOMOStore. Livraison 2 jours max en Côte d'Ivoire.`;

        this.title.setTitle(`${nom} | MOMOStore`);
        this.update({
            description,
            ogTitle:  `${nom} | MOMOStore`,
            ogUrl:    `${this.BASE_URL}/boutique/product-overview/${id}`,
            ogImage:  image ?? this.DEFAULT_IMAGE,
            canonical:`${this.BASE_URL}/boutique/product-overview/${id}`,
        });

        this.injectProductJsonLd(nom, desc, image, id, prix);
    }

    private update(params: {
        description: string | null;
        ogTitle:  string;
        ogUrl:    string;
        ogImage:  string;
        canonical:string;
    }): void {
        const desc = params.description?.slice(0, 155) ?? '';

        this.meta.updateTag({ name: 'description', content: desc });
        this.meta.updateTag({ property: 'og:title',       content: params.ogTitle });
        this.meta.updateTag({ property: 'og:description', content: desc });
        this.meta.updateTag({ property: 'og:url',         content: params.ogUrl });
        this.meta.updateTag({ property: 'og:image',       content: params.ogImage });
        this.meta.updateTag({ name: 'twitter:title',       content: params.ogTitle });
        this.meta.updateTag({ name: 'twitter:description', content: desc });
        this.meta.updateTag({ name: 'twitter:image',       content: params.ogImage });

        this.setCanonical(params.canonical);
    }

    private setCanonical(url: string): void {
        let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
        if (!link) {
            link = this.doc.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.doc.head.appendChild(link);
        }
        link.setAttribute('href', url);
    }

    private injectProductJsonLd(nom: string, desc: string, image: string | null, id: number, prix: number): void {
        const existing = this.doc.getElementById('product-jsonld');
        if (existing) existing.remove();

        const script = this.doc.createElement('script');
        script.id = 'product-jsonld';
        script.type = 'application/ld+json';
        script.text = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: nom,
            description: desc,
            image: image ?? this.DEFAULT_IMAGE,
            url: `${this.BASE_URL}/boutique/product-overview/${id}`,
            brand: { '@type': 'Brand', name: 'MOMOStore' },
            offers: {
                '@type': 'Offer',
                priceCurrency: 'XOF',
                price: prix,
                availability: 'https://schema.org/InStock',
                seller: { '@type': 'Organization', name: 'MOMOStore' }
            }
        });
        this.doc.head.appendChild(script);
    }
}
