import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// 👇 Import Services
import { PaperService } from '../../../services/paper';
import { ReviewService } from '../../../services/review';
import { AuthService } from '../../../services/auth';
import { ConferenceService } from '../../../services/conference'; // TAMBAH: Import ConferenceService

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-list.html',
  styleUrl: './review-list.css'
})
export class ReviewList implements OnInit {

  papers: any[] = [];
  activeConferences: any[] = []; // TAMBAH: Property untuk simpan active conferences
  isLoading: boolean = true;
  loggedUser: any = null;

  constructor(
    private router: Router,
    private paperService: PaperService,   // 👈 Inject PaperService
    private reviewService: ReviewService, // 👈 Inject ReviewService
    private authService: AuthService,      // 👈 Inject AuthService
    private conferenceService: ConferenceService // TAMBAH: Inject ConferenceService
  ) {}

  ngOnInit() {
    // Get the current logged-in user from Service
    this.loggedUser = this.authService.getLoggedUser();

    if (this.loggedUser) {
      this.loadPapers();
      this.loadActiveConferences(); // TAMBAH: Muatkan active conferences
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

  // TAMBAH: Kaedah untuk muatkan active conferences
  loadActiveConferences() {
    this.conferenceService.getAllConferences().subscribe(data => {
      // Filter untuk active conferences (Ongoing atau Upcoming)
      this.activeConferences = data.filter(c =>
        c.status === 'Ongoing' || c.status === 'Upcoming' || !c.status
      );
    });
  }

  // Action: Go to Grading Page
  onGrade(paperId: number) {
    this.router.navigate(['/dashboard/review', paperId]);
  }

  // TAMBAH: Kaedah untuk lihat butiran conference
  viewConferenceDetails(conferenceId: number) {
    this.router.navigate(['/conference-details', conferenceId]);
  }
}
