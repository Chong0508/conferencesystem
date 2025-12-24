import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReviewService } from '../../../services/review.service';
import { PaperService } from '../../../services/paper.service';

@Component({
  selector: 'app-review-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-history.html',
  styleUrl: './review-history.css'
})
export class ReviewHistory implements OnInit {
  historyList: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private reviewService: ReviewService,
    private paperService: PaperService
  ) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    const userJson = localStorage.getItem('loggedUser');
    const currentUser = userJson ? JSON.parse(userJson) : null;
    
    // Ensure we are grabbing the correct ID key from your login response
    const reviewerId = currentUser?.userId ?? currentUser?.user_id ?? currentUser?.id;

    if (!reviewerId) {
      console.error("No Reviewer ID found in session.");
      this.isLoading = false;
      return;
    }

    this.reviewService.getReviewsByReviewer(Number(reviewerId)).subscribe({
      next: (reviews: any[]) => {
        if (!reviews || reviews.length === 0) {
          this.historyList = [];
          this.isLoading = false;
          return;
        }

        this.paperService.getAllPapers().subscribe({
          next: (papers: any[]) => {
            this.historyList = reviews.map(r => {
              // Match assignment_id (Review table) to paperId (Paper table)
              const pId = r.assignment_id || r.assignmentId;
              const paper = papers.find(p => p.paperId === pId);
              
              return {
                reviewId: r.review_id || r.reviewId,
                paperId: pId,
                paperTitle: paper ? paper.title : 'Unknown Paper',
                score: r.overall_score || r.overallScore || 0,
                recommendation: r.recommendation,
                // Display the KL time timestamp
                date: r.reviewed_at || r.reviewedAt || r.due_date,
                trackId: paper ? paper.trackId : '?'
              };
            }).reverse();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to map papers:', err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Failed to load reviews:', err);
        this.isLoading = false;
      }
    });
  }

  viewReview(paperId: number) {
    this.router.navigate(['/dashboard/review', paperId]);
  }

  getScoreColor(score: number, recommendation?: string): string {
    // If the paper was deleted, the score is no longer relevant
    if (recommendation === 'Deleted by Admin') return 'text-muted opacity-50';
    
    if (score >= 320) return 'text-success fw-bold';
    if (score >= 240) return 'text-warning fw-bold';
    return 'text-danger fw-bold';
  }
}