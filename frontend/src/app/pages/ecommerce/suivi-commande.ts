import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommandeService } from '@services/commande.service';
import { WhatsappService } from '@services/whatsapp.service';

interface EtapeTimeline {
    statut: string;
    label: string;
    desc: string;
    icon: string;
}

const ETAPES: EtapeTimeline[] = [
    { statut: 'EN_ATTENTE',   label: 'Commande reçue',    desc: 'Votre commande a bien été enregistrée.', icon: 'check-circle' },
    { statut: 'CONFIRMEE',    label: 'Commande confirmée', desc: 'Le vendeur a confirmé votre commande.', icon: 'thumbs-up' },
    { statut: 'EN_COURS',     label: 'En préparation',     desc: 'Votre maillot est en cours de préparation chez le fournisseur.', icon: 'package' },
    { statut: 'EXPEDIEE',     label: 'En route',           desc: 'Votre commande est en cours de livraison.', icon: 'truck' },
    { statut: 'LIVREE',       label: 'Livrée',             desc: 'Votre commande a été livrée. Bonne dégustation !', icon: 'gift' },
];

const STATUT_INDEX: Record<string, number> = {
    'EN_ATTENTE': 0,
    'CONFIRMEE': 1,
    'EN_COURS': 2,
    'EXPEDIEE': 3,
    'LIVREE': 4,
    'ANNULEE': -1,
};

@Component({
    selector: 'app-suivi-commande',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="sc-shell">

            <!-- HEADER -->
            <div class="sc-header">
                <div class="sc-header__inner">
                    <button class="sc-back-btn" (click)="retourBoutique()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                        Retour
                    </button>
                    <div class="sc-header__title">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                        Suivi de commande
                    </div>
                </div>
            </div>

            <div class="sc-container">

                <!-- FORMULAIRE DE RECHERCHE -->
                <div class="sc-search-card">
                    <h2 class="sc-search-card__title">Où en est ma commande ?</h2>
                    <p class="sc-search-card__hint">
                        Entrez votre numéro de commande reçu par WhatsApp (format&nbsp;: <strong>CMD-20260523-XXXXXX</strong>)
                    </p>
                    <div class="sc-search-row">
                        <input
                            class="sc-input"
                            type="text"
                            [(ngModel)]="numeroSaisi"
                            placeholder="CMD-20260523-XXXXXX"
                            (keydown.enter)="rechercher()"
                            [disabled]="chargement()"
                        />
                        <button class="sc-search-btn" (click)="rechercher()" [disabled]="chargement() || !numeroSaisi.trim()">
                            @if (chargement()) {
                                <svg class="sc-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0110 10" stroke-linecap="round"/></svg>
                            } @else {
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            }
                            Rechercher
                        </button>
                    </div>
                    @if (erreur()) {
                        <p class="sc-error">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            {{ erreur() }}
                        </p>
                    }
                </div>

                <!-- RÉSULTAT -->
                @if (commande()) {
                    <div class="sc-result">

                        <!-- En-tête résultat -->
                        <div class="sc-result__header">
                            <div>
                                <div class="sc-result__numero">{{ commande()!.numero }}</div>
                                <div class="sc-result__client">{{ commande()!.clientNom }}</div>
                                <div class="sc-result__date">
                                    Commandé le {{ commande()!.dateCreation | date:'dd MMMM yyyy':'':'fr' }}
                                </div>
                            </div>
                            <div class="sc-result__total">
                                <span>Total</span>
                                <strong>{{ formatPrix(commande()!.montantTotal) }} FCFA</strong>
                            </div>
                        </div>

                        <!-- Statut annulé -->
                        @if (commande()!.statut === 'ANNULEE') {
                            <div class="sc-annulee">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                Commande annulée — Contactez-nous via WhatsApp pour plus d'informations.
                            </div>
                        }

                        <!-- Timeline -->
                        @if (commande()!.statut !== 'ANNULEE') {
                            <div class="sc-timeline">
                                @for (etape of etapes; track etape.statut; let i = $index) {
                                    <div class="sc-timeline__step"
                                         [class.sc-timeline__step--done]="i <= statutIndex()"
                                         [class.sc-timeline__step--active]="i === statutIndex()">
                                        <div class="sc-timeline__line" *ngIf="i < etapes.length - 1"></div>
                                        <div class="sc-timeline__dot">
                                            @if (i < statutIndex()) {
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                            } @else if (i === statutIndex()) {
                                                <div class="sc-timeline__pulse"></div>
                                            }
                                        </div>
                                        <div class="sc-timeline__content">
                                            <strong>{{ etape.label }}</strong>
                                            @if (i <= statutIndex()) {
                                                <span>{{ etape.desc }}</span>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        }

                        <!-- Articles -->
                        @if (commande()!.lignes?.length) {
                            <div class="sc-articles">
                                <h3 class="sc-articles__title">Articles commandés</h3>
                                @for (ligne of commande()!.lignes; track ligne.id) {
                                    <div class="sc-article-item">
                                        <div class="sc-article-item__info">
                                            <strong>{{ ligne.produitNom }}</strong>
                                            <span>{{ ligne.taille }} · {{ ligne.couleur }}</span>
                                            @if (ligne.flocage) {
                                                <span class="sc-article-item__flocage">
                                                    Flocage : {{ detailFlocage(ligne.flocageNom, ligne.flocageNumero) }}
                                                </span>
                                            }
                                        </div>
                                        <div class="sc-article-item__right">
                                            <span>×{{ ligne.quantite }}</span>
                                            <strong>{{ formatPrix(ligne.prixTotal) }} FCFA</strong>
                                        </div>
                                    </div>
                                }
                            </div>
                        }

                        <!-- Contact WhatsApp -->
                        <div class="sc-contact">
                            <p>Une question sur votre commande ?</p>
                            <button class="sc-wa-btn" (click)="contacterWhatsApp()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                                Contacter le vendeur
                            </button>
                        </div>

                    </div>
                }

            </div>
        </div>
    `,
    styles: [`
        :host { display: block; background: #faf7f2; min-height: 100vh; font-family: 'Poppins', 'Segoe UI', sans-serif; }

        /* HEADER */
        .sc-header {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a0800 50%, #0d1200 100%);
            padding: 1.25rem 0;
            border-bottom: 2px solid rgba(255,107,53,0.3);
        }
        .sc-header__inner {
            max-width: 760px; margin: 0 auto; padding: 0 1.5rem;
            display: flex; align-items: center; gap: 1rem;
        }
        .sc-back-btn {
            display: inline-flex; align-items: center; gap: 0.4rem;
            background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.75);
            border: 1px solid rgba(255,255,255,0.12); border-radius: 0.5rem;
            padding: 0.4rem 0.85rem; font-size: 0.8rem; cursor: pointer;
            transition: background 0.2s;
        }
        .sc-back-btn:hover { background: rgba(255,255,255,0.14); }
        .sc-header__title {
            display: flex; align-items: center; gap: 0.6rem;
            color: #fff; font-size: 1.1rem; font-weight: 700;
        }

        /* CONTAINER */
        .sc-container { max-width: 760px; margin: 0 auto; padding: 2rem 1.5rem; }

        /* SEARCH CARD */
        .sc-search-card {
            background: #fff; border-radius: 1rem; padding: 2rem;
            box-shadow: 0 2px 16px rgba(0,0,0,0.07); margin-bottom: 2rem;
        }
        .sc-search-card__title { margin: 0 0 0.5rem; font-size: 1.25rem; font-weight: 700; color: #111; }
        .sc-search-card__hint { color: #888; font-size: 0.85rem; margin: 0 0 1.5rem; line-height: 1.6; }
        .sc-search-row { display: flex; gap: 0.75rem; }
        .sc-input {
            flex: 1; height: 46px; padding: 0 1rem;
            border: 1.5px solid #ede8e0; border-radius: 0.6rem;
            font-size: 0.9rem; font-family: 'Courier New', monospace;
            color: #111; background: #faf7f2; outline: none;
            transition: border-color 0.2s;
        }
        .sc-input:focus { border-color: #FF6B35; background: #fff; }
        .sc-input:disabled { opacity: 0.5; }
        .sc-search-btn {
            height: 46px; padding: 0 1.5rem;
            background: #1a1a1a; color: #fff;
            border: none; border-radius: 0.6rem;
            font-size: 0.85rem; font-weight: 600; cursor: pointer;
            display: inline-flex; align-items: center; gap: 0.5rem;
            transition: background 0.2s; white-space: nowrap;
        }
        .sc-search-btn:hover:not(:disabled) { background: #FF6B35; }
        .sc-search-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .sc-spinner { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .sc-error {
            display: flex; align-items: center; gap: 0.4rem;
            color: #e53e3e; font-size: 0.82rem; margin-top: 0.85rem;
        }

        /* RESULT */
        .sc-result {
            background: #fff; border-radius: 1rem;
            box-shadow: 0 2px 16px rgba(0,0,0,0.07);
            overflow: hidden;
            animation: fadeUp 0.4s ease both;
        }
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: none; }
        }
        .sc-result__header {
            display: flex; justify-content: space-between; align-items: flex-start;
            padding: 1.5rem 1.75rem;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a0800 100%);
            color: #fff;
        }
        .sc-result__numero { font-family: 'Courier New', monospace; font-size: 0.85rem; color: #FF6B35; font-weight: 700; margin-bottom: 0.3rem; }
        .sc-result__client { font-size: 1.05rem; font-weight: 700; }
        .sc-result__date { font-size: 0.78rem; color: rgba(255,255,255,0.5); margin-top: 0.2rem; }
        .sc-result__total { text-align: right; }
        .sc-result__total span { display: block; font-size: 0.72rem; color: rgba(255,255,255,0.5); margin-bottom: 0.2rem; }
        .sc-result__total strong { font-size: 1.1rem; color: #FF6B35; }

        /* ANNULEE */
        .sc-annulee {
            display: flex; align-items: center; gap: 0.75rem;
            background: #fff5f5; color: #c53030; font-size: 0.85rem;
            padding: 1rem 1.75rem; border-bottom: 1px solid #fed7d7;
        }

        /* TIMELINE */
        .sc-timeline {
            padding: 1.75rem;
            display: flex; flex-direction: column; gap: 0;
        }
        .sc-timeline__step {
            display: flex; gap: 1rem; position: relative;
            padding-bottom: 1.5rem;
        }
        .sc-timeline__step:last-child { padding-bottom: 0; }
        .sc-timeline__line {
            position: absolute; left: 16px; top: 32px;
            width: 2px; height: calc(100% - 0px);
            background: #ede8e0;
        }
        .sc-timeline__step--done .sc-timeline__line { background: #FF6B35; }
        .sc-timeline__dot {
            width: 32px; height: 32px; border-radius: 50%;
            background: #ede8e0; flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
            color: #999; z-index: 1; transition: background 0.3s, color 0.3s;
        }
        .sc-timeline__step--done .sc-timeline__dot { background: #FF6B35; color: #fff; }
        .sc-timeline__step--active .sc-timeline__dot { background: #FF6B35; box-shadow: 0 0 0 5px rgba(255,107,53,0.2); }
        .sc-timeline__pulse {
            width: 10px; height: 10px; border-radius: 50%;
            background: #fff; animation: pulse 1.4s ease infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.7; }
        }
        .sc-timeline__content { padding-top: 4px; }
        .sc-timeline__content strong { display: block; font-size: 0.88rem; color: #bbb; font-weight: 600; }
        .sc-timeline__step--done .sc-timeline__content strong { color: #111; }
        .sc-timeline__content span { font-size: 0.78rem; color: #888; line-height: 1.5; margin-top: 0.2rem; display: block; }

        /* ARTICLES */
        .sc-articles { padding: 0 1.75rem 1.75rem; border-top: 1px solid #f0ebe2; }
        .sc-articles__title { font-size: 0.85rem; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.06em; margin: 1.25rem 0 0.85rem; }
        .sc-article-item {
            display: flex; justify-content: space-between; align-items: flex-start;
            padding: 0.75rem 0; border-bottom: 1px solid #f5f0e6;
        }
        .sc-article-item:last-child { border-bottom: none; }
        .sc-article-item__info { display: flex; flex-direction: column; gap: 0.2rem; }
        .sc-article-item__info strong { font-size: 0.88rem; color: #111; }
        .sc-article-item__info span { font-size: 0.75rem; color: #888; }
        .sc-article-item__flocage { color: #FF6B35 !important; font-weight: 500; }
        .sc-article-item__right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.2rem; }
        .sc-article-item__right span { font-size: 0.75rem; color: #888; }
        .sc-article-item__right strong { font-size: 0.9rem; color: #FF6B35; font-weight: 700; }

        /* CONTACT */
        .sc-contact {
            padding: 1.25rem 1.75rem;
            background: #faf7f2; border-top: 1px solid #ede8e0;
            display: flex; align-items: center; justify-content: space-between; gap: 1rem;
        }
        .sc-contact p { margin: 0; font-size: 0.82rem; color: #888; }
        .sc-wa-btn {
            display: inline-flex; align-items: center; gap: 0.5rem;
            background: #25D366; color: #fff;
            border: none; border-radius: 0.6rem;
            padding: 0.6rem 1.2rem; font-size: 0.82rem; font-weight: 600;
            cursor: pointer; transition: background 0.2s; white-space: nowrap;
        }
        .sc-wa-btn:hover { background: #1ebe5d; }

        /* RESPONSIVE */
        @media (max-width: 600px) {
            .sc-container { padding: 1.25rem 1rem; }
            .sc-search-row { flex-direction: column; }
            .sc-search-btn { width: 100%; justify-content: center; }
            .sc-result__header { flex-direction: column; gap: 0.75rem; }
            .sc-result__total { text-align: left; }
            .sc-contact { flex-direction: column; align-items: flex-start; }
        }
    `]
})
export class SuiviCommandeComponent implements OnInit {
    numeroSaisi = '';
    commande = signal<any>(null);
    chargement = signal(false);
    erreur = signal('');

    readonly etapes = ETAPES;

    private whatsappService = inject(WhatsappService);

    constructor(
        private commandeService: CommandeService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        const numero = this.route.snapshot.queryParamMap.get('numero');
        if (numero) {
            this.numeroSaisi = numero;
            this.rechercher();
        }
    }

    rechercher(): void {
        const numero = this.numeroSaisi.trim().toUpperCase();
        if (!numero) return;

        this.erreur.set('');
        this.commande.set(null);
        this.chargement.set(true);

        this.commandeService.suivreCommande(numero).subscribe({
            next: (data) => {
                this.commande.set(data);
                this.chargement.set(false);
            },
            error: () => {
                this.erreur.set('Commande introuvable. Vérifiez le numéro et réessayez.');
                this.chargement.set(false);
            }
        });
    }

    statutIndex(): number {
        const statut = this.commande()?.statut ?? 'EN_ATTENTE';
        return STATUT_INDEX[statut] ?? 0;
    }

    detailFlocage(nom: string | null, numero: string | null): string {
        return [nom, numero].filter(v => v && v.trim().length > 0).join(' ');
    }

    formatPrix(prix: number | string): string {
        return new Intl.NumberFormat('fr-FR').format(Number(prix));
    }

    retourBoutique(): void {
        this.router.navigate(['/boutique']);
    }

    contacterWhatsApp(): void {
        const numero = this.whatsappService.getNumero();
        const msg = this.commande()
            ? `Bonjour, j'ai une question concernant ma commande ${this.commande()!.numero}.`
            : 'Bonjour, j\'ai une question sur ma commande.';
        window.open(`https://wa.me/${numero.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    }
}
