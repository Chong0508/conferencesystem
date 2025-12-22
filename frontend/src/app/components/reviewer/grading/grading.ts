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
    this.paperService.getPaperById(this.paperId).subscribe({
      next: (paperData) => {
        this.paper = paperData;
        console.log('Loaded paper:', paperData);
      },
      error: (err) => {
        console.error('Error loading paper:', err);
        this.errorMessage = 'Failed to load paper';
      }
    });
  }

  getManuscriptUrl(): string {
      if (!this.paper) return '#';
      const path = this.paper.submissionFile || this.paper.fileName;
      if (!path) return '#';

      const fileName = encodeURIComponent(path.split('/').pop() || '');
      return `http://localhost:8080/papers/manuscript/${fileName}`;
    }

  // Submit Review to Backend
  submitReview() {
    if (this.totalScore === 0) {
      alert("Please score the paper before submitting.");
      return;
    }
    if (!this.comments.trim()) {
      alert("Please add comments for the review.");
      return;
    }

    const reviewData = {
      assignment_id: this.paperId,                 // paperId → assignment_id
      reviewer_id: this.currentUser.user_id,       // logged user
      overall_score: this.totalScore,              // totalScore from frontend calculation
      comments_to_author: this.comments,
      comments_to_chair: '',                        // optional
      recommendation: this.recommendation,
      round_number: 1,                              // default round
      due_date: new Date(),                         // current date
      attachment: null,                             // optional
      reviewed_at: new Date()                       // timestamp
    };

    this.isSubmitting = true;
    this.reviewService.submitReview(reviewData).subscribe({
      next: (res) => {
        alert("✅ Review Submitted Successfully!");
        this.isSubmitting = false;
        this.router.navigate(['/dashboard/review-history']);
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        this.errorMessage = 'Failed to submit review';
        this.isSubmitting = false;
        alert("❌ Error submitting review. Check console.");
      }
    });
  }


  cancel() {
    this.router.navigate(['/dashboard/reviews']);
  }
}
