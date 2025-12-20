import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) {}

  // Create payment / checkout session
  createPayment(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload, { withCredentials: true });
  }

  // Get payment status
  getPaymentStatus(paymentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${paymentId}/status`, { withCredentials: true });
  }

  // Admin: list all payments
  getAllPayments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { withCredentials: true });
  }

  // Admin: refund / update payment
  refundPayment(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/refund`, {}, { withCredentials: true });
  }
}
