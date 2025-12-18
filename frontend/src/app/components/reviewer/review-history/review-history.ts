import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    setTimeout(() => {
      // 1. Get Data from LocalStorage
      const currentUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
      const allReviews = JSON.parse(localStorage.getItem('mock_reviews') || '[]');
      const allPapers = JSON.parse(localStorage.getItem('mock_papers') || '[]');

      // 2. Filter reviews done by THIS reviewer
      // (Assuming we saved 'reviewerEmail' when grading. If not, we list all for demo)
      const myReviews = allReviews.filter((r: any) => r.reviewerEmail === currentUser.email);

      // 3. Merge Review Data with Paper Title
      this.historyList = myReviews.map((review: any) => {
        const paper = allPapers.find((p: any) => p.id == review.paperId);
        return {
          ...review,
          paperTitle: paper ? paper.title : 'Unknown Paper',
          trackId: paper ? paper.trackId : '?'
        };
      });

      this.isLoading = false;
    }, 500);
  }

  // Allow re-visiting the grading page (ReadOnly mode maybe? Or just edit)
  viewReview(paperId: number) {
    this.router.navigate(['/dashboard/review', paperId]);
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'text-success fw-bold';
    if (score >= 60) return 'text-warning fw-bold';
    return 'text-danger fw-bold';
  }
}
