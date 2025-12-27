// review.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
   private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/api/reviews`;

  constructor(private http: HttpClient) {}

  submitReview(reviewData: any): Observable<any> {
    return this.http.post(this.apiUrl, reviewData, { withCredentials: true });
  }

  getReviews(): Observable<any> {
    return this.http.get(this.apiUrl, { withCredentials: true });
  }

  getReviewById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
