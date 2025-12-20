import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../../../services/review.service';
import { PaperService } from '../../../services/paper.service';

@Component({
  selector: 'app-grading',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grading.html',
  styleUrl: './grading.css'
})
export class Grading implements OnInit {

  paperId: any;
  paper: any = null;
  currentUser: any = {};
  isSubmitting: boolean = false;
  errorMessage: string = '';

  // Form Data
  scoreCriteria: any = {
    originality: 0,
    relevance: 0,
    quality: 0,
    presentation: 0
  };
  comments: string = '';
  recommendation: string = 'Accept';

  // Helper to calculate total
  get totalScore(): number {
    return this.scoreCriteria.originality +
      this.scoreCriteria.relevance +
      this.scoreCriteria.quality +
      this.scoreCriteria.presentation;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private paperService: PaperService
  ) {}

  ngOnInit() {
    this.paperId = this.route.snapshot.paramMap.get('id');

    // Get Current User (Reviewer)
    const userJson = localStorage.getItem('loggedUser');
    if (userJson) {
      this.currentUser = JSON.parse(userJson);
    }

    this.loadPaper();
  }

  loadPaper() {
    // Fetch paper from backend
    this.paperService.getPapersByAuthor(this.paperId).subscribe({
      next: (paperData) => {
        this.paper = paperData;
      },
      error: (err) => {
        console.error('Error loading paper:', err);
        this.errorMessage = 'Failed to load paper';
      }
    });
  }

  // Submit Review to Backend
  submitReview() {
    // 1. Validation
    if (this.totalScore === 0) {
      alert("Please score the paper before submitting.");
      return;
    }

    if (!this.comments.trim()) {
      alert("Please add comments for the review.");
      return;
    }

    // 2. Create Review Object
    const reviewData = {
      paperId: this.paperId,
      reviewerId: this.currentUser.user_id,
      overallScore: this.totalScore,
      scoreCriteria: this.scoreCriteria,
      recommendation: this.recommendation,
      commentsToAuthor: this.comments,
      commentsToChair: '',
      roundNumber: 1,
      dueDate: new Date(),
      attachment: null
    };

    // 3. Submit to Backend
    this.isSubmitting = true;
    this.reviewService.submitReview(reviewData).subscribe({
      next: (response) => {
        alert("✅ Review Submitted Successfully!");
        this.isSubmitting = false;
        this.router.navigate(['/dashboard/review-history']);
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        this.errorMessage = 'Failed to submit review';
        this.isSubmitting = false;
        alert("❌ Error submitting review. Please try again.");
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/reviews']);
  }
}
