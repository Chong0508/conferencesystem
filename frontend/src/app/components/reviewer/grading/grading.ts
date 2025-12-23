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

  scoreCriteria: any = {
    originality: 0,
    relevance: 0,
    quality: 0,
    presentation: 0
  };
  comments: string = '';
  recommendation: string = 'Accept';

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
      },
      error: (err) => {
        console.error('Error loading paper:', err);
        this.errorMessage = 'Failed to load paper';
      }
    });
  }

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
      assignment_id: this.paperId,
      reviewer_id: this.currentUser.user_id,
      overall_score: this.totalScore,
      comments_to_author: this.comments,
      comments_to_chair: '',
      recommendation: this.recommendation,
      round_number: 1,
      due_date: new Date(),
      attachment: null,
      reviewed_at: new Date()
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
        this.isSubmitting = false;
        alert("❌ Error submitting review.");
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/reviews']);
  }

  getManuscriptUrl(fileName: string | undefined): string {
    if (!fileName) return '#';
    // Point directly to the refined endpoint - No .split().pop() needed!
    return `http://localhost:8080/api/papers/download/${fileName}`;
  }

  // Add a simple helper for the UI text
  getCleanFileName(fullPath: string | undefined): string {
    if (!fullPath) return 'Manuscript.pdf';
    const parts = fullPath.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : fullPath;
  }
}