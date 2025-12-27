import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Review {
  review_id?: number;
  paperId?: number;
  reviewerId?: number;
  reviewerEmail?: string;
  score?: number;
  comments?: string;
  created_at?: string;
  [key: string]: any;
}
export interface ReviewAssignedPaper {
  paperId?: number;
  title?: string;
  status?: string;
  trackId?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/api/reviews`;

  constructor(private http: HttpClient) {}

  // Get reviews by reviewer id
  getReviewsByReviewer(reviewerId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/reviews/reviewer/${reviewerId}`);
  }

  // Get all reviews (admin)
  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl, { withCredentials: true });
  }

  // Get reviews by paper id
  getReviewsByPaper(paperId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/paper/${paperId}`, { withCredentials: true });
  }

  getReviewById(id: number): Observable<any> {
      return this.http.get(`${this.apiUrl}/${id}`, { withCredentials: true });
    }


  // submit or update review
  submitReview(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload, { withCredentials: true });
  }

  updateReview(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload, { withCredentials: true });
  }

  deleteReview(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // Backend should return papers assigned to reviewer
  getAssignedPapers(reviewerId: number): Observable<ReviewAssignedPaper[]> {
    return this.http.get<ReviewAssignedPaper[]>(`${this.apiUrl}/assigned-papers/${reviewerId}`, {withCredentials: true});
  }
}
