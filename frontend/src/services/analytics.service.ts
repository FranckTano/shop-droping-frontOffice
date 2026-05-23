import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare let gtag: Function;

// Remplacez G-XXXXXXXXXX par votre Measurement ID Google Analytics 4
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private router = inject(Router);
  private initialized = false;

  init(): void {
    if (this.initialized || typeof gtag === 'undefined') return;
    this.initialized = true;

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      gtag('config', GA_MEASUREMENT_ID, {
        page_path: event.urlAfterRedirects
      });
    });
  }

  trackEvent(eventName: string, params: Record<string, any> = {}): void {
    if (typeof gtag === 'undefined') return;
    gtag('event', eventName, params);
  }

  trackPageView(path: string, title?: string): void {
    if (typeof gtag === 'undefined') return;
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title
    });
  }

  // Événements métier e-commerce
  trackAddToCart(produit: { id: number; nom: string; prix: number }): void {
    this.trackEvent('add_to_cart', {
      currency: 'XOF',
      value: produit.prix,
      items: [{ item_id: produit.id, item_name: produit.nom, price: produit.prix }]
    });
  }

  trackPurchase(commandeId: number, montant: number): void {
    this.trackEvent('purchase', {
      transaction_id: commandeId.toString(),
      currency: 'XOF',
      value: montant
    });
  }

  trackViewItem(produit: { id: number; nom: string; prix: number }): void {
    this.trackEvent('view_item', {
      currency: 'XOF',
      value: produit.prix,
      items: [{ item_id: produit.id, item_name: produit.nom, price: produit.prix }]
    });
  }
}
