import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// 👇 Import Services
import { PaperService } from '../../../services/paper';
import { ReviewService } from '../../../services/review';
import { AuthService } from '../../../services/auth';

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

  constructor(
    private router: Router,
    private paperService: PaperService,   // 👈 Inject PaperService
    private reviewService: ReviewService, // 👈 Inject ReviewService
    private authService: AuthService      // 👈 Inject AuthService
  ) {}

  ngOnInit() {
    // Get the current logged-in user from Service
    this.loggedUser = this.authService.getLoggedUser();

    if (this.loggedUser) {
      this.loadPapers();
    } else {
      this.isLoading = false;
    }
  }

  loadPapers() {
    this.isLoading = true;

    // 1. Fetch all papers
    this.paperService.getAllPapers().subscribe((allPapers: any[]) => {

      // 2. Fetch all completed reviews
      this.reviewService.getAllReviews().subscribe((allReviews: any[]) => {

        if (this.loggedUser) {
          this.papers = allPapers.filter((p: any) => {

            // Condition A: Check if the paper is assigned to the current reviewer
            // Note: Make sure your paper object has 'assignedReviewer' field (set by Admin)
            const isAssignedToMe = p.assignedReviewer === this.loggedUser.email;

            // Condition B: Check if this paper has already been reviewed
            const isAlreadyReviewed = allReviews.some((r: any) =>
              String(r.paperId) === String(p.id) && r.reviewerEmail === this.loggedUser.email
            );

            // Final Result: Only show papers that are assigned AND NOT yet reviewed
            return isAssignedToMe && !isAlreadyReviewed;
          });
        }

        this.isLoading = false;
      });
    });
  }

  // Action: Go to Grading Page
  onGrade(paperId: number) {
    this.router.navigate(['/dashboard/review', paperId]);
  }
}
