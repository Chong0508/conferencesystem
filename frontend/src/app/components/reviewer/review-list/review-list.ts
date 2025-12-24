import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaperService } from '../../../services/paper.service';
import { ReviewService } from '../../../services/review.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-list.html',
  styleUrl: './review-list.css'
})
export class ReviewList implements OnInit {

  papers: any[] = [];
  isLoading: boolean = true;
  currentUser: any;

  constructor(
    private paperService: PaperService,
    private reviewService: ReviewService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadPapers();
  }

  loadPapers() {
    this.isLoading = true;
    const currentUserId = this.currentUser?.user_id || this.currentUser?.userId || this.currentUser?.id;
    const role = (this.currentUser?.role || '').toLowerCase();

    if (!currentUserId) {
      console.error('User ID not found');
      this.isLoading = false;
      return;
    }

    // === SCENARIO A: ADMIN (Can see ALL papers) ===
    if (role === 'admin' || role === 'super admin') {
      this.paperService.getAllPapers().subscribe({
        next: (data) => {
          this.papers = data.filter(p => p.status === 'Pending Review');
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Admin Fetch error:", err);
          this.isLoading = false;
        }
      });
    }

    // === SCENARIO B: REVIEWER (Can only see ASSIGNED papers) ===
    else if (role === 'reviewer') {
      this.reviewService.getReviewsByReviewer(currentUserId).subscribe({
        next: (reviews) => {
          this.papers = reviews.map((r: any) => {
             const paper = r.paper || {};
             paper.reviewId = r.reviewId;
             return paper;
          });

          this.isLoading = false;
        },
        error: (err) => {
          console.error("Reviewer Fetch error:", err);
          this.isLoading = false;
        }
      });
    }
  }

  onGrade(paper: any) {

    const idToUse = paper.paperId || paper.id;

    if (!idToUse) {
      console.error("Navigation failed: Paper ID is missing!");
      return;
    }
    this.router.navigate(['/dashboard/review', idToUse]);
  }
}
