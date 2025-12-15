import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// 👇 Import Services
import { ReviewService } from '../../../services/review';
import { PaperService } from '../../../services/paper';
import { AuthService } from '../../../services/auth';

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

  constructor(
    private router: Router,
    private reviewService: ReviewService, // 👈 Inject ReviewService
    private paperService: PaperService,   // 👈 Inject PaperService
    private authService: AuthService      // 👈 Inject AuthService
  ) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    const currentUser = this.authService.getLoggedUser();

    if (!currentUser) {
      this.isLoading = false;
      return;
    }

    // 1. Get all reviews
    this.reviewService.getAllReviews().subscribe((allReviews: any[]) => {

      // 2. Get all papers (to map titles)
      this.paperService.getAllPapers().subscribe((allPapers: any[]) => {

        // 3. Filter reviews done by THIS reviewer
        const myReviews = allReviews.filter((r: any) => r.reviewerEmail === currentUser.email);

        // 4. Merge Review Data with Paper Title
        this.historyList = myReviews.map((review: any) => {
          // Find the corresponding paper
          const paper = allPapers.find((p: any) => String(p.id) === String(review.paperId));
          return {
            ...review,
            paperTitle: paper ? paper.title : 'Unknown Paper',
            trackId: paper ? paper.trackId : '?'
          };
        });

        this.isLoading = false;
      });
    });
  }

  // Allow re-visiting the grading page
  viewReview(paperId: number) {
    this.router.navigate(['/dashboard/review', paperId]);
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'text-success fw-bold';
    if (score >= 60) return 'text-warning fw-bold';
    return 'text-danger fw-bold';
  }
}
