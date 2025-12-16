import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
// 👇 Import Notification Service
import { NotificationService } from './notification';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private storageKey = 'mock_reviews';

  constructor(
    private notificationService: NotificationService // 👈 Inject Notification Service
  ) { }

  // ==========================================
  // 1. Get All Reviews (Admin / History)
  // ==========================================
  getAllReviews(): Observable<any[]> {
    const data = localStorage.getItem(this.storageKey);
    return of(data ? JSON.parse(data) : []).pipe(delay(300));
  }

  // ==========================================
  // 2. Get Reviews by Paper ID (For Author/Admin details)
  // ==========================================
  getReviewsByPaperId(paperId: number): Observable<any[]> {
    const reviews = this.getReviewsSync();
    const paperReviews = reviews.filter((r: any) => String(r.paperId) === String(paperId));
    return of(paperReviews).pipe(delay(300));
  }

  // ==========================================
  // 3. Submit a Review (Reviewer Grading)
  // ==========================================
  submitReview(reviewData: any): Observable<any> {
    const reviews = this.getReviewsSync();

    // Check duplicate
    const exists = reviews.find((r: any) =>
      String(r.paperId) === String(reviewData.paperId) &&
      r.reviewerEmail === reviewData.reviewerEmail
    );

    if (exists) {
      return of({ success: false, message: 'You have already reviewed this paper.' });
    }

    // Add metadata
    reviewData.id = Date.now();
    reviewData.submittedAt = new Date().toLocaleString();

    // Save
    reviews.push(reviewData);
    localStorage.setItem(this.storageKey, JSON.stringify(reviews));

    // 🔥🔥 TRIGGER: Notify Admin that a review is done
    // Since we might not have the paper title here, we send a generic message or ID
    this.notificationService.notifyAdminReviewCompleted(
      reviewData.reviewerEmail,
      `Paper ID #${reviewData.paperId}` // Or use Title if available in reviewData
    );

    return of({ success: true, message: 'Review submitted successfully!' }).pipe(delay(500));
  }

  // --- Internal Helper ---
  private getReviewsSync(): any[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }
}
