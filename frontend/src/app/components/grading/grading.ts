import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private route: ActivatedRoute, private router: Router) {}

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
    // Find paper by ID
    const allPapers = JSON.parse(localStorage.getItem('mock_papers') || '[]');
    this.paper = allPapers.find((p: any) => p.id == this.paperId);
  }

  // 👇 FIXED: Ensure data is saved to LocalStorage
  submitReview() {
    // 1. Validation
    if (this.totalScore === 0) {
      alert("Please score the paper before submitting.");
      return;
    }

    // 2. Create Review Object
    const newReview = {
      id: Date.now(),
      paperId: this.paperId,
      reviewerEmail: this.currentUser.email, // Important for History
      score: this.totalScore,
      breakdown: this.scoreCriteria,
      recommendation: this.recommendation,
      comments: this.comments,
      date: new Date()
    };

    // 3. Save to 'mock_reviews'
    const existingReviews = JSON.parse(localStorage.getItem('mock_reviews') || '[]');
    existingReviews.push(newReview);
    localStorage.setItem('mock_reviews', JSON.stringify(existingReviews));

    // 4. Update Paper Status to 'Reviewed' in 'mock_papers'
    const allPapers = JSON.parse(localStorage.getItem('mock_papers') || '[]');
    const paperIndex = allPapers.findIndex((p: any) => p.id == this.paperId);

    if (paperIndex > -1) {
      allPapers[paperIndex].status = 'Reviewed'; // Change Status
      localStorage.setItem('mock_papers', JSON.stringify(allPapers));
    }

    // 5. Success & Redirect
    alert("✅ Review Submitted Successfully!");
    this.router.navigate(['/dashboard/review-history']); // Go to History to verify
  }

  cancel() {
    this.router.navigate(['/dashboard/reviews']);
  }
}
