import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) { }

  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      withCredentials: true
    });
  }

  getReviewById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  submitReview(reviewData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reviewData, {
      withCredentials: true
    });
  }

  updateReview(id: number, reviewData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, reviewData, {
      withCredentials: true
    });
  }

  deleteReview(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  getReviewsByPaper(paperId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paper/${paperId}`, {
      withCredentials: true
    });
  }

  getReviewsByReviewer(reviewerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reviewer/${reviewerId}`, {
      withCredentials: true
    });
  }
}
