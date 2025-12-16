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

  // Stores papers specifically assigned to this reviewer
  papers: any[] = [];
  isLoading: boolean = true;
  loggedUser: any = null;

  constructor(
    private router: Router,
    private paperService: PaperService,   // 👈 Inject PaperService
    private reviewService: ReviewService, // 👈 Inject ReviewService
    private authService: AuthService      // 👈 Inject AuthService
    // ❌ REMOVED: ConferenceService (Not needed here)
  ) {}

  ngOnInit() {
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

      // 2. Fetch reviews I have already completed
      this.reviewService.getAllReviews().subscribe((allReviews: any[]) => {

        if (this.loggedUser) {
          this.papers = allPapers.filter((p: any) => {

            // Condition A: Check if the paper is assigned to me
            const isAssignedToMe = p.assignedReviewer === this.loggedUser.email;

            // Condition B: Check if I have already reviewed it
            // Using String() to ensure ID types match
            const isAlreadyReviewed = allReviews.some((r: any) =>
              String(r.paperId) === String(p.id) && r.reviewerEmail === this.loggedUser.email
            );

            // Final Result: Show only Assigned AND Not Yet Reviewed
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
