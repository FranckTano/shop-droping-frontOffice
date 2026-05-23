import {
  Component, OnChanges, OnDestroy, Input, Output, EventEmitter,
  ElementRef, ViewChild, SimpleChanges, NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const L: any;

export interface AdresseInfo {
  adresse: string;
  lienGps: string;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: any;
}

@Component({
  selector: 'app-adresse-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ym-root">

      <!-- Barre de recherche style Yango -->
      <div class="ym-search-wrap">
        <div class="ym-search-box">
          <i class="pi pi-search ym-search-icon"></i>
          <input
            #searchInput
            class="ym-search-input"
            type="text"
            [(ngModel)]="texteRecherche"
            (ngModelChange)="onSaisie($event)"
            (keydown.enter)="rechercherManuel()"
            placeholder="Entrez votre adresse de livraison..."
            autocomplete="off"
          />
          <button *ngIf="texteRecherche" class="ym-search-clear" type="button" (click)="effacerRecherche()">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- Bouton Ma position -->
        <button class="ym-gps-btn" type="button" (click)="maPosition()" [class.ym-gps-btn--loading]="gpsChargement" title="Ma position actuelle">
          <i class="pi" [class.pi-map-marker]="!gpsChargement" [class.pi-spin]="gpsChargement" [class.pi-spinner]="gpsChargement"></i>
        </button>
      </div>

      <!-- Liste de suggestions -->
      <div *ngIf="suggestions.length > 0" class="ym-suggestions">
        <button
          *ngFor="let s of suggestions"
          class="ym-suggestion-item"
          type="button"
          (click)="choisirSuggestion(s)"
        >
          <i class="pi pi-map-marker ym-sug-icon"></i>
          <span class="ym-sug-text">{{ s.display_name }}</span>
        </button>
      </div>

      <!-- Chargement suggestions -->
      <div *ngIf="rechercheChargement" class="ym-loading-suggestions">
        <i class="pi pi-spin pi-spinner"></i> Recherche en cours...
      </div>

      <!-- Adresse confirmée -->
      <div *ngIf="adresseAffichee && !suggestions.length" class="ym-adresse-chip">
        <i class="pi pi-check-circle"></i>
        <span>{{ adresseAffichee }}</span>
        <button class="ym-chip-reset" type="button" (click)="reinitialiser()">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <!-- Mini carte de confirmation (lecture seule) -->
      <div *ngIf="latSelectionnee !== null" class="ym-map-wrap">
        <div #mapEl class="ym-map-el"></div>
      </div>

    </div>
  `,
  styles: [`
    .ym-root { display: flex; flex-direction: column; gap: 0.5rem; }

    /* ── Barre de recherche ── */
    .ym-search-wrap {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .ym-search-box {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }

    .ym-search-icon {
      position: absolute;
      left: 0.85rem;
      color: #94a3b8;
      font-size: 1rem;
      pointer-events: none;
    }

    .ym-search-input {
      width: 100%;
      padding: 0.7rem 2.5rem 0.7rem 2.5rem;
      border: 1.5px solid #e2e8f0;
      border-radius: 0.75rem;
      font-size: 0.9rem;
      color: #1e293b;
      background: #fff;
      outline: none;
      transition: border-color .2s, box-shadow .2s;
      box-shadow: 0 1px 4px rgba(0,0,0,.05);
    }
    .ym-search-input::placeholder { color: #94a3b8; }
    .ym-search-input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59,130,246,.12);
    }

    .ym-search-clear {
      position: absolute;
      right: 0.7rem;
      background: none;
      border: none;
      cursor: pointer;
      color: #94a3b8;
      padding: 0.2rem;
      display: flex;
      align-items: center;
      font-size: 0.85rem;
      transition: color .15s;
    }
    .ym-search-clear:hover { color: #475569; }

    /* ── Bouton GPS ── */
    .ym-gps-btn {
      flex-shrink: 0;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 0.75rem;
      border: 1.5px solid #e2e8f0;
      background: #fff;
      color: #3b82f6;
      font-size: 1.1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background .15s, border-color .15s, box-shadow .15s;
      box-shadow: 0 1px 4px rgba(0,0,0,.05);
    }
    .ym-gps-btn:hover {
      background: #eff6ff;
      border-color: #3b82f6;
    }
    .ym-gps-btn--loading { color: #94a3b8; }

    /* ── Suggestions ── */
    .ym-suggestions {
      background: #fff;
      border: 1.5px solid #e2e8f0;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,.1);
      max-height: 220px;
      overflow-y: auto;
    }

    .ym-suggestion-item {
      width: 100%;
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      padding: 0.7rem 1rem;
      background: none;
      border: none;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      text-align: left;
      transition: background .12s;
    }
    .ym-suggestion-item:last-child { border-bottom: none; }
    .ym-suggestion-item:hover { background: #f8fafc; }

    .ym-sug-icon {
      color: #3b82f6;
      font-size: 0.9rem;
      margin-top: 0.1rem;
      flex-shrink: 0;
    }

    .ym-sug-text {
      font-size: 0.83rem;
      color: #334155;
      line-height: 1.4;
    }

    /* ── Loader suggestions ── */
    .ym-loading-suggestions {
      font-size: 0.8rem;
      color: #64748b;
      padding: 0.4rem 0.2rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    /* ── Chip adresse confirmée ── */
    .ym-adresse-chip {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 0.65rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.82rem;
      color: #166534;
    }
    .ym-adresse-chip i { color: #16a34a; flex-shrink: 0; }
    .ym-adresse-chip span { flex: 1; }

    .ym-chip-reset {
      background: none;
      border: none;
      cursor: pointer;
      color: #16a34a;
      padding: 0.1rem;
      opacity: .6;
      transition: opacity .15s;
      display: flex;
      align-items: center;
    }
    .ym-chip-reset:hover { opacity: 1; }

    /* ── Mini carte ── */
    .ym-map-wrap {
      border-radius: 0.75rem;
      overflow: hidden;
      border: 1.5px solid #e2e8f0;
    }

    .ym-map-el {
      height: 180px;
    }
  `]
})
export class AdresseMapComponent implements OnChanges, OnDestroy {
  @Input() active = false;
  @Output() adresseChoisie = new EventEmitter<AdresseInfo>();
  @ViewChild('mapEl') mapEl!: ElementRef<HTMLDivElement>;

  texteRecherche = '';
  suggestions: Suggestion[] = [];
  adresseAffichee = '';
  rechercheChargement = false;
  gpsChargement = false;

  latSelectionnee: number | null = null;
  lngSelectionnee: number | null = null;

  private map: any = null;
  private marker: any = null;
  private debounceTimer: any = null;

  constructor(private zone: NgZone) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active']?.currentValue === false) {
      this.detruireMap();
    }
  }

  ngOnDestroy(): void {
    this.detruireMap();
    clearTimeout(this.debounceTimer);
  }

  onSaisie(texte: string): void {
    this.suggestions = [];
    clearTimeout(this.debounceTimer);
    if (texte.trim().length < 3) return;
    this.rechercheChargement = true;
    this.debounceTimer = setTimeout(() => this.rechercherSuggestions(texte), 400);
  }

  rechercherManuel(): void {
    if (this.texteRecherche.trim().length < 2) return;
    clearTimeout(this.debounceTimer);
    this.rechercheChargement = true;
    this.rechercherSuggestions(this.texteRecherche);
  }

  private async rechercherSuggestions(texte: string): Promise<void> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texte)}&limit=5&countrycodes=ci&addressdetails=1&accept-language=fr`;
    try {
      const resp = await fetch(url, { headers: { 'Accept-Language': 'fr' } });
      const data: Suggestion[] = await resp.json();
      this.zone.run(() => {
        this.suggestions = data;
        this.rechercheChargement = false;
      });
    } catch {
      this.zone.run(() => { this.rechercheChargement = false; });
    }
  }

  choisirSuggestion(s: Suggestion): void {
    const lat = parseFloat(s.lat);
    const lng = parseFloat(s.lon);
    const adresse = this.formaterAdresseNominatim(s);

    this.texteRecherche = adresse;
    this.suggestions = [];
    this.adresseAffichee = adresse;
    this.latSelectionnee = lat;
    this.lngSelectionnee = lng;

    const lienGps = `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
    this.adresseChoisie.emit({ adresse, lienGps });

    setTimeout(() => this.afficherSurCarte(lat, lng), 200);
  }

  maPosition(): void {
    if (!navigator.geolocation) return;
    this.gpsChargement = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        this.zone.run(() => {
          this.gpsChargement = false;
          this.geocoderInverse(lat, lng);
        });
      },
      () => {
        this.zone.run(() => { this.gpsChargement = false; });
      },
      { timeout: 10000 }
    );
  }

  private async geocoderInverse(lat: number, lng: number): Promise<void> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1&accept-language=fr`;
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      const adresse = this.formaterAdresse(data, lat, lng);
      this.zone.run(() => {
        this.adresseAffichee = adresse;
        this.texteRecherche = adresse;
        this.suggestions = [];
        this.latSelectionnee = lat;
        this.lngSelectionnee = lng;
        const lienGps = `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
        this.adresseChoisie.emit({ adresse, lienGps });
        setTimeout(() => this.afficherSurCarte(lat, lng), 200);
      });
    } catch {
      const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      this.zone.run(() => {
        this.adresseAffichee = fallback;
        this.texteRecherche = fallback;
        this.latSelectionnee = lat;
        this.lngSelectionnee = lng;
        const lienGps = `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
        this.adresseChoisie.emit({ adresse: fallback, lienGps });
        setTimeout(() => this.afficherSurCarte(lat, lng), 200);
      });
    }
  }

  private afficherSurCarte(lat: number, lng: number): void {
    if (!this.mapEl?.nativeElement) return;

    const icone = L.divIcon({
      className: '',
      html: `<div style="width:24px;height:24px;background:#3b82f6;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    });

    if (!this.map) {
      this.map = L.map(this.mapEl.nativeElement, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19
      }).addTo(this.map);
    } else {
      this.map.setView([lat, lng], 15);
    }

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { icon: icone }).addTo(this.map);
    }
  }

  effacerRecherche(): void {
    this.texteRecherche = '';
    this.suggestions = [];
  }

  reinitialiser(): void {
    this.texteRecherche = '';
    this.suggestions = [];
    this.adresseAffichee = '';
    this.latSelectionnee = null;
    this.lngSelectionnee = null;
    this.detruireMap();
    this.adresseChoisie.emit({ adresse: '', lienGps: '' });
  }

  private formaterAdresseNominatim(s: Suggestion): string {
    const a = s.address ?? {};
    const quartier = a.road ?? a.neighbourhood ?? a.quarter ?? a.suburb ?? '';
    const commune  = a.city_district ?? a.town ?? a.village ?? '';
    const ville    = a.city ?? a.municipality ?? '';
    const dept     = a.county ?? a.state_district ?? '';
    const parties  = [quartier, commune, ville, dept].filter((p, i, arr) => p && arr.indexOf(p) === i);
    return parties.join(', ') || s.display_name;
  }

  private formaterAdresse(data: any, lat: number, lng: number): string {
    const a = data?.address ?? {};
    const quartier = a.road ?? a.neighbourhood ?? a.quarter ?? a.suburb ?? '';
    const commune  = a.city_district ?? a.town ?? a.village ?? '';
    const ville    = a.city ?? a.municipality ?? '';
    const dept     = a.county ?? a.state_district ?? '';
    const parties  = [quartier, commune, ville, dept].filter((p, i, arr) => p && arr.indexOf(p) === i);
    return parties.join(', ') || data?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }

  private detruireMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
    }
  }
}
