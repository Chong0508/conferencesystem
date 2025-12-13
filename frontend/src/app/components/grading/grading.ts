import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // 👈 Import ActivatedRoute

@Component({
  selector: 'app-grading',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grading.html',
  styleUrl: './grading.css'
})
export class Grading implements OnInit {

  paperId: any;
  paperData: any = null; // To store the paper details

  // Review Object (Matches ERD 'Review' table)
  reviewObj: any = {
    score: null,
    comments: '',
    recommendation: '' // 'Accept', 'Reject', 'Revision'
  };

  isLoading: boolean = true;
  isSubmitting: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // 1. Get the Paper ID from the URL (e.g. /dashboard/review/123)
    this.paperId = this.route.snapshot.paramMap.get('id');

    // 2. Load the specific paper details
    this.loadPaperDetails();
  }

  loadPaperDetails() {
    // Simulate fetching from backend
    setTimeout(() => {
      const allPapers = JSON.parse(localStorage.getItem('mock_papers') || '[]');

      // Find the paper with the matching ID
      // Note: We use '==' because ID from URL is string, ID in JSON might be number
      this.paperData = allPapers.find((p: any) => p.id == this.paperId);

      this.isLoading = false;
    }, 500);
  }

  onSubmitReview() {
    if (!this.reviewObj.score || !this.reviewObj.recommendation || !this.reviewObj.comments) {
      alert("Please complete all fields (Score, Recommendation, Comments).");
      return;
    }

    this.isSubmitting = true;

    // --- SIMULATION START ---

    // 1. Save the Review
    const newReview = {
      reviewId: Date.now(),
      paperId: this.paperId,
      reviewer: JSON.parse(localStorage.getItem('loggedUser') || '{}').firstName,
      ...this.reviewObj,
      submittedAt: new Date()
    };

    const existingReviews = JSON.parse(localStorage.getItem('mock_reviews') || '[]');
    existingReviews.push(newReview);
    localStorage.setItem('mock_reviews', JSON.stringify(existingReviews));

    // 2. Update Paper Status (e.g., from 'Pending' to 'Reviewed')
    const allPapers = JSON.parse(localStorage.getItem('mock_papers') || '[]');
    const paperIndex = allPapers.findIndex((p: any) => p.id == this.paperId);

    if (paperIndex !== -1) {
      allPapers[paperIndex].status = 'Reviewed'; // Update status
      localStorage.setItem('mock_papers', JSON.stringify(allPapers));
    }

    // --- SIMULATION END ---

    setTimeout(() => {
      this.isSubmitting = false;
      alert("Review Submitted Successfully!");
      this.router.navigateByUrl('/dashboard/reviews'); // Go back to list
    }, 1500);
  }

  onCancel() {
    this.router.navigateByUrl('/dashboard/reviews');
  }
}
