import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PaiementService } from '@services/paiement.service';
import { WhatsappService } from '@services/whatsapp.service';

@Component({
    selector: 'app-paiement-retour',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="pr-shell">
            <div class="pr-card">

                @if (chargement()) {
                    <div class="pr-loading">
                        <svg class="pr-spinner" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" stroke-width="2">
                            <circle cx="12" cy="12" r="10" stroke-opacity="0.2"/>
                            <path d="M12 2a10 10 0 0110 10" stroke-linecap="round"/>
                        </svg>
                        <p>Vérification du paiement en cours...</p>
                    </div>
                }

                @if (!chargement() && statut() === 'PAYE') {
                    <div class="pr-success">
                        <div class="pr-icon pr-icon--success">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <h1>Paiement réussi !</h1>
                        <p>Votre commande <strong>{{ commandeNumero() }}</strong> a bien été payée.</p>
                        <p class="pr-hint">Vous recevrez une confirmation via WhatsApp. Délai de livraison : 2–5 jours ouvrés.</p>
                        <div class="pr-actions">
                            <button class="pr-btn pr-btn--primary" (click)="allerAuSuivi()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                                Suivre ma commande
                            </button>
                            <button class="pr-btn pr-btn--outline" (click)="allerBoutique()">
                                Retour à la boutique
                            </button>
                        </div>
                    </div>
                }

                @if (!chargement() && statut() === 'ECHEC') {
                    <div class="pr-failure">
                        <div class="pr-icon pr-icon--failure">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </div>
                        <h1>Paiement échoué</h1>
                        <p>Le paiement n'a pas pu être finalisé. Votre commande est conservée.</p>
                        <p class="pr-hint">Vous pouvez réessayer en commandant à nouveau ou via WhatsApp.</p>
                        <div class="pr-actions">
                            <button class="pr-btn pr-btn--whatsapp" (click)="contacterWhatsApp()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                                Commander via WhatsApp
                            </button>
                            <button class="pr-btn pr-btn--outline" (click)="allerBoutique()">
                                Retour à la boutique
                            </button>
                        </div>
                    </div>
                }

                @if (!chargement() && statut() === 'EN_ATTENTE_PAIEMENT') {
                    <div class="pr-pending">
                        <div class="pr-icon pr-icon--pending">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </div>
                        <h1>Paiement en attente</h1>
                        <p>Votre commande <strong>{{ commandeNumero() }}</strong> est en attente de confirmation de paiement.</p>
                        <p class="pr-hint">Cela peut prendre quelques minutes. Vous serez notifié(e) par WhatsApp.</p>
                        <div class="pr-actions">
                            <button class="pr-btn pr-btn--primary" (click)="allerAuSuivi()">Suivre ma commande</button>
                            <button class="pr-btn pr-btn--outline" (click)="allerBoutique()">Retour boutique</button>
                        </div>
                    </div>
                }

            </div>
        </div>
    `,
    styles: [`
        :host { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #faf7f2; font-family: 'Poppins', 'Segoe UI', sans-serif; }

        .pr-shell { width: 100%; max-width: 480px; padding: 2rem 1.25rem; }
        .pr-card { background: #fff; border-radius: 1.25rem; padding: 2.5rem 2rem; box-shadow: 0 4px 32px rgba(0,0,0,0.1); text-align: center; }

        .pr-loading { display: flex; flex-direction: column; align-items: center; gap: 1rem; color: #888; }
        .pr-spinner { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .pr-icon {
            width: 80px; height: 80px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 1.5rem;
        }
        .pr-icon--success { background: linear-gradient(135deg, #38a169, #48bb78); }
        .pr-icon--failure { background: linear-gradient(135deg, #e53e3e, #fc8181); }
        .pr-icon--pending { background: linear-gradient(135deg, #d69e2e, #f6c90e); }

        h1 { font-size: 1.5rem; font-weight: 700; color: #111; margin: 0 0 0.75rem; }
        p { color: #666; font-size: 0.9rem; line-height: 1.6; margin: 0 0 0.5rem; }
        p strong { color: #111; font-family: 'Courier New', monospace; }
        .pr-hint { font-size: 0.8rem; color: #aaa; margin-top: 0.5rem; }

        .pr-actions { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 2rem; }
        .pr-btn {
            width: 100%; height: 46px; border-radius: 0.6rem; border: none;
            font-size: 0.88rem; font-weight: 600; cursor: pointer;
            display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
            transition: opacity 0.2s;
        }
        .pr-btn:hover { opacity: 0.88; }
        .pr-btn--primary { background: #1a1a1a; color: #fff; }
        .pr-btn--outline { background: transparent; border: 1.5px solid #ede8e0; color: #555; }
        .pr-btn--whatsapp { background: #25D366; color: #fff; }
    `]
})
export class PaiementRetourComponent implements OnInit {
    chargement = signal(true);
    statut = signal('EN_ATTENTE_PAIEMENT');
    commandeNumero = signal('');
    private transactionId = '';
    private commandeId = '';
    private whatsappService = inject(WhatsappService);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private paiementService: PaiementService
    ) {}

    ngOnInit(): void {
        this.transactionId = this.route.snapshot.queryParamMap.get('transactionId') ?? '';
        this.commandeId = this.route.snapshot.queryParamMap.get('commandeId') ?? '';

        if (!this.transactionId) {
            this.chargement.set(false);
            this.statut.set('ECHEC');
            return;
        }

        this.paiementService.verifierStatut(this.transactionId).subscribe({
            next: (data) => {
                this.commandeNumero.set(data.numero ?? '');
                this.statut.set(data.statutPaiement ?? 'EN_ATTENTE_PAIEMENT');
                this.chargement.set(false);
            },
            error: () => {
                this.statut.set('EN_ATTENTE_PAIEMENT');
                this.chargement.set(false);
            }
        });
    }

    allerAuSuivi(): void {
        const params = this.commandeNumero() ? { queryParams: { numero: this.commandeNumero() } } : {};
        this.router.navigate(['/boutique/ma-commande'], params);
    }

    allerBoutique(): void {
        this.router.navigate(['/boutique']);
    }

    contacterWhatsApp(): void {
        const numero = this.whatsappService.getNumero().replace(/[^0-9]/g, '');
        const msg = encodeURIComponent('Bonjour, j\'ai un problème avec mon paiement.');
        window.open(`https://wa.me/${numero}?text=${msg}`, '_blank');
    }
}
