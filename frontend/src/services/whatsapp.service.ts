import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {
  private readonly numeroVendeur = '+2250799136306';
  private readonly backofficeUrl = environment.backOfficeUrl;
  private readonly frontofficeUrl = environment.url;

  creerMessageCommande(commande: any, commandeId: number, commandeNumero?: string): string {
    const ref = commandeNumero ? `N° ${commandeNumero}` : `#${commandeId}`;
    let message = `🛒 *NOUVELLE COMMANDE ${ref} - MOMOStore*\n\n`;
    message += `👤 *Client:* ${commande.nomClient}\n`;
    message += `📱 *Téléphone:* ${commande.telephoneClient}\n`;
    message += `📍 *Adresse:* ${commande.adresseClient}\n`;
    if (commande.note) {
      message += `📝 *Notes:* ${commande.note}\n`;
    }
    message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📦 *ARTICLES COMMANDÉS:*\n\n`;

    commande.articles.forEach((article: any, index: number) => {
      message += `${index + 1}. *${article.produitNom || ('Produit ID: ' + article.produitId)}*\n`;
      message += `   📏 Taille: ${article.options.taille}\n`;
      message += `   🎨 Couleur: ${article.options.couleur}\n`;
      if (article.options.badgesOfficiels) {
        message += `   ✅ Badges officiels\n`;
      }
      if (article.options.flocage) {
        const detailFlocage = [article.options.flocageNom, article.options.flocageNumero]
          .filter((value: string) => !!value && value.trim().length > 0)
          .join(' ');
        message += `   🧵 Flocage: ${detailFlocage || article.options.flocageTexte || 'Oui'}\n`;
      }
      message += `   🔢 Quantité: ${article.quantite}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💵 *TOTAL: ${this.formatPrix(commande.montantTotal)} FCFA*\n\n`;
    message += `⏱️ *Délai de livraison : 2–5 jours ouvrés* après confirmation\n`;
    message += `📦 Produits sur commande — préparation sous 24h\n\n`;
    message += `Merci pour votre commande ! 🙏\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🔗 *Gérer cette commande (Admin) :*\n`;
    message += `${this.backofficeUrl}/admin/commandes/${commandeId}\n\n`;
    if (commandeNumero) {
      message += `📲 *Lien de suivi pour le client :*\n`;
      message += `${this.frontofficeUrl}/boutique/ma-commande?numero=${commandeNumero}`;
    }

    return message;
  }

  creerMessageMobileMoney(commande: any, commandeId: number, commandeNumero?: string): string {
    const ref = commandeNumero ? `N° ${commandeNumero}` : `#${commandeId}`;
    let message = `💳 *PAIEMENT MOBILE MONEY - MOMOStore*\n`;
    message += `Commande ${ref}\n\n`;
    message += `👤 *Client:* ${commande.nomClient}\n`;
    message += `📱 *Téléphone:* ${commande.telephoneClient}\n`;
    message += `📍 *Adresse:* ${commande.adresseClient}\n\n`;

    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📦 *Articles:*\n`;
    commande.articles.forEach((article: any, index: number) => {
      message += `${index + 1}. ${article.produitNom || ('Produit #' + article.produitId)}`;
      message += ` — Taille: ${article.options.taille}, Qté: ${article.quantite}\n`;
    });

    message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💵 *MONTANT À PAYER : ${this.formatPrix(commande.montantTotal)} FCFA*\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📲 *INSTRUCTIONS DE PAIEMENT :*\n\n`;
    message += `Envoyez *${this.formatPrix(commande.montantTotal)} FCFA* au numéro :\n`;
    message += `➡️ *${this.numeroVendeur}*\n\n`;
    message += `✅ Via *Wave*, *Orange Money* ou *MTN MoMo*\n\n`;
    message += `Après le transfert, envoyez ici :\n`;
    message += `• La *capture d'écran* de votre reçu\n`;
    message += `• Votre *numéro de commande* : ${ref}\n\n`;
    message += `Votre commande sera traitée dès réception du paiement. 🙏`;

    return message;
  }

  construireLien(message: string): string {
    const encodedMessage = encodeURIComponent(message);
    const cleanNumero = this.numeroVendeur.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumero}?text=${encodedMessage}`;
  }

  envoyerMessage(message: string): void {
    window.location.href = this.construireLien(message);
  }

  private formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix);
  }
}
