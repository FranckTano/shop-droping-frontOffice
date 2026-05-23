import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/paiement';

  initierPaiement(commandeId: number): Observable<{
    code: string;
    message: string;
    data?: { payment_url: string; payment_token: string };
  }> {
    return this.http.post<any>(`${this.apiUrl}/initier/${commandeId}`, {});
  }

  verifierStatut(transactionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statut/${encodeURIComponent(transactionId)}`);
  }
}
