import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  loggedUser: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    // Get the current logged-in user from Local Storage
    const userStr = localStorage.getItem('loggedUser');
    if (userStr) {
      this.loggedUser = JSON.parse(userStr);
      this.loadPapers();
    } else {
      // If no user is found, stop loading (or redirect to log in)
      this.isLoading = false;
    }
  }

  loadPapers() {
    // Simulate network delay for better UX
    setTimeout(() => {
      // 1. Fetch all papers from Local Storage
      const allPapers = JSON.parse(localStorage.getItem('mock_papers') || '[]');

      // 2. Fetch all completed reviews
      // We need to check this list to hide papers that are already graded.
      const allReviews = JSON.parse(localStorage.getItem('mock_reviews') || '[]');

      if (this.loggedUser) {
        this.papers = allPapers.filter((p: any) => {

          // Condition A: Check if the paper is assigned to the current reviewer
          const isAssignedToMe = p.assignedReviewer === this.loggedUser.email;

          // Condition B: Check if this paper has already been reviewed
          // CRITICAL FIX: Use String() to prevent type mismatch (e.g., number 123 vs string "123")
          const isAlreadyReviewed = allReviews.some((r: any) =>
            String(r.paperId) === String(p.id) && r.reviewerEmail === this.loggedUser.email
          );

          // Final Result: Only show papers that are assigned AND NOT yet reviewed
          return isAssignedToMe && !isAlreadyReviewed;
        });
      }

      this.isLoading = false;
    }, 500);
  }

  // Action: Go to Grading Page
  onGrade(paperId: number) {
    this.router.navigate(['/dashboard/review', paperId]);
  }
}
