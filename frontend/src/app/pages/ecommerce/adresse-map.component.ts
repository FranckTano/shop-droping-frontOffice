import { Component, OnChanges, OnDestroy, Input, Output, EventEmitter, ElementRef, ViewChild, SimpleChanges, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

// Leaflet est chargé en global via angular.json scripts — on déclare le namespace
declare const L: any;

export interface AdresseInfo {
  adresse: string;
  lienGps: string;
}

@Component({
  selector: 'app-adresse-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-bloc">
      <div class="map-hint">
        <i class="pi pi-info-circle"></i>
        Cliquez sur la carte pour indiquer votre position exacte
      </div>

      <div #mapEl class="map-el"></div>

      <div *ngIf="chargement" class="geocoding-loader">
        <i class="pi pi-spin pi-spinner"></i> Localisation...
      </div>

      <div *ngIf="adresseAffichee" class="adresse-chip">
        <i class="pi pi-map-marker"></i>
        <span>{{ adresseAffichee }}</span>
        <button class="chip-reset" type="button" (click)="reinitialiser()">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .map-bloc { position: relative; }

    .map-hint {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      color: #64748b;
      margin-bottom: 0.4rem;
    }

    .map-el {
      height: 280px;
      border-radius: 0.75rem;
      border: 1.5px solid rgba(15,23,42,.12);
      overflow: hidden;
      cursor: crosshair;
    }

    .geocoding-loader {
      position: absolute;
      bottom: 3rem;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255,255,255,.92);
      backdrop-filter: blur(4px);
      border-radius: 999px;
      padding: 0.3rem 0.9rem;
      font-size: 0.8rem;
      color: #334155;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,.1);
    }

    .adresse-chip {
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 0.6rem;
      padding: 0.45rem 0.75rem;
      font-size: 0.82rem;
      color: #166534;
    }

    .adresse-chip i { color: #16a34a; flex-shrink: 0; }
    .adresse-chip span { flex: 1; }

    .chip-reset {
      background: none;
      border: none;
      cursor: pointer;
      color: #16a34a;
      padding: 0 0.2rem;
      font-size: 0.9rem;
      line-height: 1;
      opacity: .7;
      transition: opacity .15s;
    }
    .chip-reset:hover { opacity: 1; }
  `]
})
export class AdresseMapComponent implements OnChanges, OnDestroy {
  @Input() active = false;
  @Output() adresseChoisie = new EventEmitter<AdresseInfo>();
  @ViewChild('mapEl') mapEl!: ElementRef<HTMLDivElement>;

  private map: any = null;
  private marker: any = null;
  adresseAffichee = '';
  chargement = false;

  constructor(private zone: NgZone) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active']?.currentValue === true) {
      setTimeout(() => this.initMap(), 250);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initMap(): void {
    if (this.map || !this.mapEl?.nativeElement) return;

    // Marqueur CSS — aucune image externe requise (évite le bug d'icône Leaflet)
    const icone = L.divIcon({
      className: '',
      html: `<div style="width:26px;height:26px;background:#ef4444;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 26]
    });

    // Centré sur la Côte d'Ivoire
    this.map = L.map(this.mapEl.nativeElement, {
      center: [7.54, -5.55],
      zoom: 7,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      this.zone.run(() => this.onClic(e.latlng.lat, e.latlng.lng, icone));
    });
  }

  private onClic(lat: number, lng: number, icone: any): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { icon: icone }).addTo(this.map);
    }
    this.chargement = true;
    this.geocoderInverse(lat, lng);
  }

  private async geocoderInverse(lat: number, lng: number): Promise<void> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1&accept-language=fr`;
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      const adresse = this.formaterAdresse(data, lat, lng);
      this.zone.run(() => {
        this.adresseAffichee = adresse;
        this.chargement = false;
        this.emettre(adresse, lat, lng);
      });
    } catch {
      const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      this.zone.run(() => {
        this.adresseAffichee = fallback;
        this.chargement = false;
        this.emettre(fallback, lat, lng);
      });
    }
  }

  private formaterAdresse(data: any, lat: number, lng: number): string {
    const a = data?.address ?? {};

    const quartier = a.road ?? a.neighbourhood ?? a.quarter ?? a.suburb ?? '';
    const commune  = a.city_district ?? a.town ?? a.village ?? '';
    const ville    = a.city ?? a.municipality ?? '';
    const dept     = a.county ?? a.state_district ?? '';

    const parties = [quartier, commune, ville, dept]
      .filter((p, i, arr) => p && arr.indexOf(p) === i);

    return parties.join(', ') || data?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }

  private emettre(adresse: string, lat: number, lng: number): void {
    const lienGps = `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
    this.adresseChoisie.emit({ adresse, lienGps });
  }

  reinitialiser(): void {
    if (this.marker) {
      this.marker.remove();
      this.marker = null;
    }
    this.adresseAffichee = '';
    this.adresseChoisie.emit({ adresse: '', lienGps: '' });
  }
}
