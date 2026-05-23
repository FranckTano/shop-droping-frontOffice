import { Component, inject, HostListener, signal, OnInit } from '@angular/core';
import { RouterModule, Router, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanierService } from '@services/panier.service';
import { AnalyticsService } from '@services/analytics.service';

@Component({
    selector: 'app-boutique-layout',
    standalone: true,
    imports: [RouterModule, CommonModule, RouterLinkActive, FormsModule],
    template: `
        <!-- ==================== NAVBAR ==================== -->
        <nav class="mn-nav" [class.mn-nav--scrolled]="scrolled()">
            <div class="mn-nav__inner">

                <!-- Logo -->
                <a class="mn-nav__logo" routerLink="/boutique" (click)="closeMenu()">
                    <div class="mn-nav__logo-mark">M</div>
                    <div class="mn-nav__logo-text">
                        <span class="mn-nav__logo-name">MOMO</span>
                        <span class="mn-nav__logo-sub">Shop</span>
                    </div>
                </a>

                <!-- Links desktop -->
                <ul class="mn-nav__links" [class.mn-nav__links--open]="menuOpen()">
                    <li>
                        <a routerLink="/boutique"
                           routerLinkActive="mn-nav__link--active"
                           [routerLinkActiveOptions]="{exact:true}"
                           (click)="closeMenu()">Catalogue</a>
                    </li>
                    <li><a (click)="naviguer('collection')">Collections</a></li>
                    <li><a (click)="naviguer('actuel')">Nouveautés</a></li>
                    <li><a (click)="naviguer('vintage-court')">Vintage</a></li>
                    <li>
                        <a routerLink="/boutique/ma-commande"
                           routerLinkActive="mn-nav__link--active"
                           (click)="closeMenu()">Suivi commande</a>
                    </li>
                    <li class="mn-nav__mobile-cart">
                        <a (click)="allerAuPanier()">
                            Panier
                            @if (panierService.nombreArticles() > 0) {
                                <span class="mn-nav__badge-inline">{{ panierService.nombreArticles() }}</span>
                            }
                        </a>
                    </li>
                </ul>

                <div class="mn-nav__actions">
                    <!-- Cart button -->
                    <button class="mn-nav__cart-btn" (click)="allerAuPanier()" aria-label="Panier">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                        @if (panierService.nombreArticles() > 0) {
                            <span class="mn-nav__cart-badge">{{ panierService.nombreArticles() }}</span>
                        }
                    </button>

                    <!-- Hamburger -->
                    <button class="mn-nav__burger" (click)="toggleMenu()" aria-label="Menu"
                            [class.mn-nav__burger--open]="menuOpen()">
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </div>
        </nav>

        <!-- Mobile overlay -->
        <div class="mn-nav__overlay"
             [class.mn-nav__overlay--visible]="menuOpen()"
             (click)="closeMenu()"></div>

        <!-- ==================== MAIN ==================== -->
        <main class="mn-main">
            <router-outlet></router-outlet>
        </main>

        <!-- ==================== FOOTER ==================== -->
        <footer class="mn-footer">
            <div class="mn-footer__inner">

                <!-- Brand -->
                <div class="mn-footer__brand">
                    <div class="mn-footer__logo">
                        <div class="mn-footer__logo-mark">M</div>
                        <div>
                            <span class="mn-footer__logo-name">MOMO</span>
                            <span class="mn-footer__logo-sub">Shop</span>
                        </div>
                    </div>
                    <p class="mn-footer__tagline">
                        La boutique de référence pour les maillots de football. Authenticité, personnalisation et style.
                    </p>
                    <!-- Social icons -->
                    <div class="mn-footer__socials">
                        <a href="#" class="mn-footer__social" aria-label="Instagram">
                            <i class="pi pi-instagram"></i>
                        </a>
                        <a href="#" class="mn-footer__social" aria-label="Facebook">
                            <i class="pi pi-facebook"></i>
                        </a>
                        <a href="#" class="mn-footer__social" aria-label="Twitter">
                            <i class="pi pi-twitter"></i>
                        </a>
                        <a href="#" class="mn-footer__social" aria-label="WhatsApp">
                            <i class="pi pi-whatsapp"></i>
                        </a>
                    </div>
                </div>

                <!-- Catalogue links -->
                <div class="mn-footer__col">
                    <h4 class="mn-footer__col-title">Catalogue</h4>
                    <nav class="mn-footer__nav">
                        <a (click)="naviguer('actuel')">Maillots Actuels</a>
                        <a (click)="naviguer('vintage-court')">Vintage Court</a>
                        <a (click)="naviguer('vintage-long')">Vintage Long</a>
                        <a (click)="naviguer('collection')">Collections</a>
                        <a routerLink="/boutique">Tout voir</a>
                    </nav>
                </div>

                <!-- Services -->
                <div class="mn-footer__col">
                    <h4 class="mn-footer__col-title">Services</h4>
                    <nav class="mn-footer__nav">
                        <a href="#">Personnalisation</a>
                        <a href="#">Flocage & Badges</a>
                        <a href="#">Livraison</a>
                        <a href="#">Commander via WhatsApp</a>
                    </nav>
                </div>

                <!-- Newsletter -->
                <div class="mn-footer__col">
                    <h4 class="mn-footer__col-title">Newsletter</h4>
                    <p class="mn-footer__newsletter-desc">Nouvelles collections et offres exclusives.</p>
                    <div class="mn-footer__newsletter-form">
                        <input
                            type="email"
                            [(ngModel)]="emailNewsletter"
                            placeholder="votre@email.com"
                            class="mn-footer__newsletter-input" />
                        <button class="mn-footer__newsletter-btn" (click)="sAbonner()">OK</button>
                    </div>
                    <p class="mn-footer__newsletter-note">{{ newsletterMessage }}</p>
                </div>
            </div>

            <!-- Bottom bar -->
            <div class="mn-footer__bottom">
                <small>© {{ annee }} MOMO Shop — Tous droits réservés.</small>
                <div class="mn-footer__bottom-links">
                    <a routerLink="/boutique/coming-soon">Confidentialité</a>
                    <a routerLink="/boutique/coming-soon">CGV</a>
                    <a routerLink="/boutique/coming-soon">Contact</a>
                </div>
            </div>
        </footer>
    `,
    styles: [`
        :host {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background: #FAF7F2;
            color: #1A1A1A;
            font-family: 'Poppins', sans-serif;
        }

        /* ===== NAVBAR ===== */
        .mn-nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: #ffffff;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            transition: box-shadow 0.3s ease;
        }

        .mn-nav--scrolled {
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
        }

        .mn-nav__inner {
            max-width: 1320px;
            margin: 0 auto;
            padding: 0 1.5rem;
            height: 68px;
            display: flex;
            align-items: center;
            gap: 2rem;
        }

        /* Logo */
        .mn-nav__logo {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            text-decoration: none;
            flex-shrink: 0;
        }

        .mn-nav__logo-mark {
            width: 36px;
            height: 36px;
            background: #1A1A1A;
            color: #ffffff;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            flex-shrink: 0;
        }

        .mn-nav__logo-text {
            display: flex;
            flex-direction: column;
            line-height: 1.1;
        }

        .mn-nav__logo-name {
            font-size: 0.95rem;
            font-weight: 800;
            letter-spacing: 0.08em;
            color: #1A1A1A;
        }

        .mn-nav__logo-sub {
            font-size: 0.65rem;
            font-weight: 400;
            letter-spacing: 0.12em;
            color: #8B7355;
            text-transform: uppercase;
        }

        /* Links */
        .mn-nav__links {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            gap: 0.15rem;
            flex: 1;
            justify-content: center;
        }

        .mn-nav__links li a {
            display: block;
            padding: 0.45rem 0.9rem;
            font-size: 0.82rem;
            font-weight: 500;
            letter-spacing: 0.04em;
            color: #555555;
            text-decoration: none;
            border-radius: 0.4rem;
            cursor: pointer;
            transition: color 0.2s ease, background 0.2s ease;
        }

        .mn-nav__links li a:hover,
        .mn-nav__links li a.mn-nav__link--active {
            color: #1A1A1A;
            background: rgba(0, 0, 0, 0.05);
        }

        .mn-nav__mobile-cart { display: none; }

        .mn-nav__badge-inline {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #1A1A1A;
            color: #ffffff;
            font-size: 0.6rem;
            font-weight: 700;
            width: 17px;
            height: 17px;
            border-radius: 50%;
            margin-left: 0.35rem;
            vertical-align: middle;
        }

        /* Actions */
        .mn-nav__actions {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-shrink: 0;
        }

        .mn-nav__cart-btn {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1.5px solid rgba(0, 0, 0, 0.15);
            background: transparent;
            color: #1A1A1A;
            cursor: pointer;
            transition: background 0.2s ease, border-color 0.2s ease;
        }

        .mn-nav__cart-btn:hover {
            background: #F5F0E6;
            border-color: rgba(0, 0, 0, 0.25);
        }

        .mn-nav__cart-badge {
            position: absolute;
            top: -3px;
            right: -3px;
            background: #1A1A1A;
            color: #ffffff;
            font-size: 0.58rem;
            font-weight: 700;
            min-width: 17px;
            height: 17px;
            border-radius: 999px;
            padding: 0 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            animation: badgePop 0.25s ease;
        }

        @keyframes badgePop {
            0% { transform: scale(0); }
            65% { transform: scale(1.15); }
            100% { transform: scale(1); }
        }

        /* Burger */
        .mn-nav__burger {
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 4.5px;
            width: 40px;
            height: 40px;
            border-radius: 0.4rem;
            border: 1.5px solid rgba(0, 0, 0, 0.12);
            background: transparent;
            cursor: pointer;
            padding: 0;
        }

        .mn-nav__burger span {
            display: block;
            width: 18px;
            height: 1.5px;
            background: #1A1A1A;
            border-radius: 2px;
            transition: transform 0.25s ease, opacity 0.25s ease;
            transform-origin: center;
        }

        .mn-nav__burger--open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .mn-nav__burger--open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .mn-nav__burger--open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* Overlay mobile */
        .mn-nav__overlay {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 999;
            background: rgba(0, 0, 0, 0.35);
            backdrop-filter: blur(3px);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .mn-nav__overlay--visible {
            opacity: 1;
            pointer-events: all;
        }

        /* ===== MAIN ===== */
        .mn-main {
            flex: 1;
            padding-top: 68px;
            min-height: calc(100vh - 68px);
        }

        /* ===== FOOTER ===== */
        .mn-footer {
            background: #ffffff;
            border-top: 1px solid rgba(0, 0, 0, 0.07);
        }

        .mn-footer__inner {
            max-width: 1320px;
            margin: 0 auto;
            padding: 3.5rem 1.5rem 2rem;
            display: grid;
            grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
            gap: 3rem;
        }

        .mn-footer__logo {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            margin-bottom: 1rem;
        }

        .mn-footer__logo-mark {
            width: 36px;
            height: 36px;
            background: #1A1A1A;
            color: #ffffff;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            font-weight: 800;
            flex-shrink: 0;
        }

        .mn-footer__logo-name {
            display: block;
            font-size: 0.95rem;
            font-weight: 800;
            letter-spacing: 0.08em;
            color: #1A1A1A;
            line-height: 1.1;
        }

        .mn-footer__logo-sub {
            display: block;
            font-size: 0.62rem;
            letter-spacing: 0.12em;
            color: #8B7355;
            text-transform: uppercase;
        }

        .mn-footer__tagline {
            color: #888888;
            font-size: 0.84rem;
            line-height: 1.65;
            margin: 0 0 1.2rem;
            max-width: 28ch;
        }

        .mn-footer__socials {
            display: flex;
            gap: 0.5rem;
        }

        .mn-footer__social {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 1.5px solid rgba(0, 0, 0, 0.12);
            color: #555555;
            text-decoration: none;
            font-size: 0.9rem;
            transition: all 0.2s ease;
        }

        .mn-footer__social:hover {
            background: #1A1A1A;
            border-color: #1A1A1A;
            color: #ffffff;
            transform: translateY(-2px);
        }

        .mn-footer__col-title {
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #1A1A1A;
            margin: 0 0 1.1rem;
            padding-bottom: 0.6rem;
            border-bottom: 1.5px solid #1A1A1A;
            display: inline-block;
        }

        .mn-footer__nav {
            display: flex;
            flex-direction: column;
            gap: 0.55rem;
        }

        .mn-footer__nav a {
            color: #777777;
            font-size: 0.86rem;
            text-decoration: none;
            cursor: pointer;
            transition: color 0.2s ease;
        }

        .mn-footer__nav a:hover { color: #1A1A1A; }

        .mn-footer__newsletter-desc {
            color: #777777;
            font-size: 0.84rem;
            margin: 0 0 0.9rem;
        }

        .mn-footer__newsletter-form {
            display: flex;
            gap: 0.35rem;
            margin-bottom: 0.45rem;
        }

        .mn-footer__newsletter-input {
            flex: 1;
            padding: 0.6rem 0.85rem;
            background: #FAF7F2;
            border: 1.5px solid rgba(0, 0, 0, 0.12);
            border-radius: 0.45rem;
            color: #1A1A1A;
            font-size: 0.84rem;
            font-family: 'Poppins', sans-serif;
            outline: none;
            transition: border-color 0.2s ease;
        }

        .mn-footer__newsletter-input:focus { border-color: #1A1A1A; }
        .mn-footer__newsletter-input::placeholder { color: #AAAAAA; }

        .mn-footer__newsletter-btn {
            padding: 0.6rem 1rem;
            background: #1A1A1A;
            color: #ffffff;
            border: none;
            border-radius: 0.45rem;
            font-size: 0.78rem;
            font-weight: 700;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: background 0.2s ease;
        }

        .mn-footer__newsletter-btn:hover { background: #333333; }

        .mn-footer__newsletter-note {
            color: #AAAAAA;
            font-size: 0.73rem;
            margin: 0;
            min-height: 1rem;
        }

        .mn-footer__bottom {
            max-width: 1320px;
            margin: 0 auto;
            padding: 1.1rem 1.5rem;
            border-top: 1px solid rgba(0, 0, 0, 0.06);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .mn-footer__bottom small { color: #AAAAAA; font-size: 0.78rem; }

        .mn-footer__bottom-links { display: flex; gap: 1.5rem; }

        .mn-footer__bottom-links a {
            color: #AAAAAA;
            font-size: 0.78rem;
            text-decoration: none;
            transition: color 0.2s ease;
        }

        .mn-footer__bottom-links a:hover { color: #1A1A1A; }

        /* ===== RESPONSIVE ===== */

        /* Tablette large (≤ 1024px) */
        @media (max-width: 1024px) {
            .mn-footer__inner { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }

        /* Tablette (≤ 768px) */
        @media (max-width: 768px) {
            .mn-nav__burger { display: flex; }

            .mn-nav__links {
                position: fixed;
                top: 68px; left: 0; right: 0; bottom: 0;
                flex-direction: column;
                justify-content: flex-start;
                align-items: stretch;
                padding: 1.5rem;
                gap: 0.2rem;
                background: #ffffff;
                transform: translateX(-100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 1000;
                overflow-y: auto;
                border-right: 1px solid rgba(0,0,0,0.06);
            }
            .mn-nav__links--open { transform: translateX(0); }
            .mn-nav__links li a { font-size: 1rem; padding: 0.8rem 1rem; }
            .mn-nav__mobile-cart { display: list-item; }
            .mn-nav__overlay { display: block; }

            .mn-footer__inner { grid-template-columns: 1fr; gap: 1.75rem; padding: 2.5rem 1.5rem 1.5rem; }
            .mn-footer__bottom { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
            .mn-footer__bottom-links { flex-wrap: wrap; gap: 1rem; }
        }

        /* Mobile (≤ 640px) */
        @media (max-width: 640px) {
            .mn-nav__inner { padding: 0 1rem; }
            .mn-footer__newsletter-form { flex-direction: column; }
            .mn-footer__newsletter-btn { width: 100%; padding: 0.7rem; }
            .mn-footer__inner { padding: 2rem 1rem 1.25rem; gap: 1.5rem; }
            .mn-footer__tagline { font-size: 0.8rem; }
        }

        /* Petit mobile (≤ 480px) */
        @media (max-width: 480px) {
            .mn-nav__inner { padding: 0 0.85rem; }
            .mn-nav__logo-name { font-size: 0.88rem; }
            .mn-nav__logo-sub { font-size: 0.56rem; }
            .mn-footer__inner { padding: 1.75rem 0.85rem 1rem; }
        }
    `]
})
export class BoutiqueLayout implements OnInit {
    panierService = inject(PanierService);
    private router = inject(Router);
    private analytics = inject(AnalyticsService);

    scrolled = signal(false);
    menuOpen = signal(false);
    annee = new Date().getFullYear();
    emailNewsletter = '';
    newsletterMessage = '';

    ngOnInit(): void {
        this.analytics.init();
    }

    @HostListener('window:scroll')
    onScroll(): void {
        this.scrolled.set(window.scrollY > 20);
    }

    allerAuPanier(): void {
        this.router.navigate(['/boutique/panier']);
        this.closeMenu();
    }

    naviguer(tab: string): void {
        this.router.navigate(['/boutique'], { queryParams: { tab } });
        this.closeMenu();
    }

    toggleMenu(): void {
        this.menuOpen.update(v => !v);
    }

    closeMenu(): void {
        this.menuOpen.set(false);
    }

    sAbonner(): void {
        if (this.emailNewsletter?.includes('@')) {
            this.newsletterMessage = '✓ Merci ! Vous êtes abonné(e).';
            this.emailNewsletter = '';
            setTimeout(() => { this.newsletterMessage = ''; }, 4000);
        } else {
            this.newsletterMessage = 'Veuillez saisir un email valide.';
        }
    }
}
