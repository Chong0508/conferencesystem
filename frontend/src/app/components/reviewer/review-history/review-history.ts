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
    this.errorMessage = '';

    const userJson = localStorage.getItem('loggedUser');
    const currentUser = userJson ? JSON.parse(userJson) : null;
    const reviewerId = currentUser?.user_id ?? currentUser?.id ?? null;

    if (!reviewerId) {
      // fallback to localStorage demo mode
      this.loadFromLocalStorage();
      return;
    }

    this.reviewService.getReviewsByReviewer(reviewerId).subscribe({
      next: (reviews: any[]) => {
        if (!reviews || reviews.length === 0) {
          this.historyList = [];
          this.isLoading = false;
          return;
        }

        // get unique paper IDs referenced by reviews
        const paperIds = Array.from(new Set(reviews.map(r => r.paperId)));

        // fetch all papers (you can optimize to fetch by ids if backend supports it)
        this.paperService.getAllPapers().subscribe({
          next: (papers: any[]) => {
            this.historyList = reviews.map(r => {
              const paper = papers.find(p => (p.paper_id ?? p.id ?? p.paperId) == r.paperId);
              return {
                ...r,
                paperTitle: paper ? (paper.title || paper.paper_title) : 'Unknown Paper',
                trackId: paper ? (paper.trackId ?? paper.track_id ?? '?') : '?'
              };
            }).reverse();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to load papers', err);
            this.historyList = reviews.map(r => ({ ...r, paperTitle: `Paper #${r.paperId}`, trackId: '?' })).reverse();
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Failed to load reviews from backend, falling back to localStorage', err);
        this.loadFromLocalStorage();
      }
    });
  }

  private loadFromLocalStorage() {
    setTimeout(() => {
      const currentUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
      const allReviews = JSON.parse(localStorage.getItem('mock_reviews') || '[]');
      const allPapers = JSON.parse(localStorage.getItem('mock_papers') || '[]');

      const myReviews = allReviews.filter((r: any) => r.reviewerEmail === currentUser.email);

      this.historyList = myReviews.map((review: any) => {
        const paper = allPapers.find((p: any) => p.id == review.paperId);
        return {
          ...review,
          paperTitle: paper ? paper.title : 'Unknown Paper',
          trackId: paper ? paper.trackId : '?'
        };
      }).reverse();

      this.isLoading = false;
    }, 200);
  }

  viewReview(paperId: number) {
    this.router.navigate(['/dashboard/review', paperId]);
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'text-success fw-bold';
    if (score >= 60) return 'text-warning fw-bold';
    return 'text-danger fw-bold';
  }

  trackById(index: number, item: any) {
    return item.id ?? item.review_id ?? index;
  }
}
