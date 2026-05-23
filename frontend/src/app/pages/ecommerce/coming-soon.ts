import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-coming-soon',
    standalone: true,
    imports: [RouterModule],
    template: `
        <div class="cs-page">
            <!-- Fond football -->
            <div class="cs-bg">
                <div class="cs-bg__grid"></div>
                <div class="cs-bg__glow"></div>
            </div>

            <div class="cs-content">
                <!-- Ballon animé -->
                <div class="cs-ball-wrap">
                    <div class="cs-ball">
                        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="60" cy="60" r="55" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                            <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(255,69,0,0.4)" stroke-width="1" stroke-dasharray="8 4"/>
                            <!-- Pentagon pattern -->
                            <polygon points="60,20 80,36 72,60 48,60 40,36" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" fill="rgba(0,0,0,0.2)"/>
                            <polygon points="60,100 80,84 72,60 48,60 40,84" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" fill="rgba(0,0,0,0.2)"/>
                            <polygon points="100,60 88,44 72,60 72,80 88,76" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" fill="rgba(0,0,0,0.2)"/>
                            <polygon points="20,60 32,44 48,60 48,80 32,76" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" fill="rgba(0,0,0,0.2)"/>
                            <circle cx="60" cy="60" r="12" stroke="rgba(255,69,0,0.6)" stroke-width="1.5" fill="none"/>
                            <circle cx="60" cy="60" r="4" fill="rgba(255,69,0,0.7)"/>
                        </svg>
                    </div>
                    <div class="cs-ball-shadow"></div>
                </div>

                <!-- Badge -->
                <span class="cs-badge">EN COURS DE DÉVELOPPEMENT</span>

                <!-- Titre -->
                <h1 class="cs-title">
                    Bientôt
                    <span class="cs-title-accent">disponible</span>
                </h1>

                <!-- Sous-titre -->
                <p class="cs-subtitle">
                    Notre équipe travaille activement sur cette section pour vous offrir une expérience premium.
                    Revenez bientôt !
                </p>

                <!-- Progress bar -->
                <div class="cs-progress">
                    <div class="cs-progress__bar">
                        <div class="cs-progress__fill"></div>
                    </div>
                    <span class="cs-progress__label">Développement en cours...</span>
                </div>

                <!-- Séparateur -->
                <div class="cs-divider"></div>

                <!-- Infos -->
                <div class="cs-info-cards">
                    <div class="cs-info-card">
                        <span class="cs-info-card__icon">⚡</span>
                        <span>Lancement imminent</span>
                    </div>
                    <div class="cs-info-card">
                        <span class="cs-info-card__icon">🏆</span>
                        <span>Expérience premium</span>
                    </div>
                    <div class="cs-info-card">
                        <span class="cs-info-card__icon">⚽</span>
                        <span>Contenu exclusif</span>
                    </div>
                </div>

                <!-- Bouton retour -->
                <a routerLink="/boutique" class="cs-back-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                        <line x1="19" y1="12" x2="5" y2="12"/>
                        <polyline points="12 19 5 12 12 5"/>
                    </svg>
                    Retour à la boutique
                </a>
            </div>
        </div>
    `,
    styles: [`
        :host {
            display: block;
            min-height: 100vh;
        }

        .cs-page {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 3rem 1.5rem;
            overflow: hidden;
        }

        /* Fond football */
        .cs-bg {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a0800 35%, #0d1500 65%, #080c0a 100%);
            z-index: 0;
        }

        .cs-bg__grid {
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
            background-size: 80px 80px;
        }

        .cs-bg__glow {
            position: absolute;
            inset: 0;
            background:
                radial-gradient(ellipse 60% 80% at 50% 50%, rgba(255, 69, 0, 0.1) 0%, transparent 65%),
                radial-gradient(ellipse 40% 50% at 80% 20%, rgba(255, 165, 0, 0.06) 0%, transparent 55%);
        }

        /* Contenu */
        .cs-content {
            position: relative;
            z-index: 1;
            text-align: center;
            max-width: 560px;
            width: 100%;
        }

        /* Ballon animé */
        .cs-ball-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 2.5rem;
        }

        .cs-ball {
            width: 120px;
            height: 120px;
            animation: ballFloat 3s ease-in-out infinite, ballSpin 8s linear infinite;
            filter: drop-shadow(0 0 30px rgba(255,69,0,0.3));
        }

        @keyframes ballFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-18px); }
        }

        @keyframes ballSpin {
            from { filter: drop-shadow(0 0 30px rgba(255,69,0,0.3)) rotate(0deg); }
            to { filter: drop-shadow(0 0 30px rgba(255,69,0,0.3)) rotate(360deg); }
        }

        .cs-ball-shadow {
            width: 70px;
            height: 12px;
            background: radial-gradient(ellipse, rgba(255,69,0,0.3) 0%, transparent 70%);
            border-radius: 50%;
            animation: shadowPulse 3s ease-in-out infinite;
            margin-top: 6px;
        }

        @keyframes shadowPulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(0.6); opacity: 0.2; }
        }

        /* Badge */
        .cs-badge {
            display: inline-block;
            font-size: 0.6rem;
            font-weight: 700;
            letter-spacing: 0.25em;
            color: #FF6B35;
            border: 1px solid rgba(255,107,53,0.35);
            border-radius: 999px;
            padding: 0.3rem 0.9rem;
            background: rgba(255,107,53,0.1);
            margin-bottom: 1.2rem;
        }

        /* Titre */
        .cs-title {
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            font-weight: 900;
            line-height: 1;
            letter-spacing: -0.025em;
            color: #ffffff;
            margin: 0 0 1.2rem;
            text-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }

        .cs-title-accent {
            color: #FF4500;
            text-shadow: 0 0 40px rgba(255,69,0,0.4);
        }

        /* Sous-titre */
        .cs-subtitle {
            font-size: 1rem;
            line-height: 1.7;
            color: rgba(255,255,255,0.6);
            max-width: 44ch;
            margin: 0 auto 2rem;
        }

        /* Progress bar */
        .cs-progress {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.6rem;
            margin-bottom: 2rem;
        }

        .cs-progress__bar {
            width: 260px;
            height: 4px;
            background: rgba(255,255,255,0.1);
            border-radius: 999px;
            overflow: hidden;
        }

        .cs-progress__fill {
            height: 100%;
            width: 65%;
            background: linear-gradient(90deg, #FF4500, #FF6B35);
            border-radius: 999px;
            animation: progressPulse 2.5s ease-in-out infinite;
        }

        @keyframes progressPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }

        .cs-progress__label {
            font-size: 0.72rem;
            color: rgba(255,255,255,0.4);
            letter-spacing: 0.06em;
        }

        /* Séparateur */
        .cs-divider {
            width: 60px;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(255,69,0,0.5), transparent);
            margin: 0 auto 2rem;
        }

        /* Info cards */
        .cs-info-cards {
            display: flex;
            gap: 0.75rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 2.5rem;
        }

        .cs-info-card {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.55rem 1rem;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 999px;
            font-size: 0.8rem;
            color: rgba(255,255,255,0.7);
            backdrop-filter: blur(8px);
            transition: background 0.2s ease;
        }

        .cs-info-card:hover {
            background: rgba(255,255,255,0.09);
        }

        .cs-info-card__icon {
            font-size: 1rem;
        }

        /* Bouton retour */
        .cs-back-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.55rem;
            padding: 0.85rem 2rem;
            background: #FF4500;
            color: #ffffff;
            border-radius: 0.6rem;
            font-size: 0.9rem;
            font-weight: 600;
            font-family: 'Poppins', sans-serif;
            text-decoration: none;
            box-shadow: 0 4px 24px rgba(255,69,0,0.35);
            transition: all 0.2s ease;
        }

        .cs-back-btn:hover {
            background: #e03d00;
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(255,69,0,0.45);
        }

        /* Tablette (≤ 768px) */
        @media (max-width: 768px) {
            .cs-title { font-size: clamp(2rem, 8vw, 3rem); }
            .cs-subtitle { font-size: 0.92rem; max-width: 36ch; }
            .cs-progress__bar { width: min(220px, 85vw); }
            .cs-info-cards { gap: 0.5rem; }
            .cs-info-card { padding: 0.5rem 0.9rem; font-size: 0.8rem; }
        }

        /* Mobile (≤ 480px) */
        @media (max-width: 480px) {
            .cs-ball { width: 90px; height: 90px; }
            .cs-info-cards { flex-direction: column; align-items: center; }
            .cs-subtitle { font-size: 0.88rem; max-width: 32ch; }
            .cs-progress__bar { width: min(200px, 90vw); }
            .cs-content { padding: 0 0.5rem; }
        }

        /* Très petit mobile (≤ 360px) */
        @media (max-width: 360px) {
            .cs-badge { font-size: 0.58rem; letter-spacing: 0.1em; }
            .cs-back-btn { width: 100%; justify-content: center; }
        }
    `]
})
export class ComingSoonComponent {}
