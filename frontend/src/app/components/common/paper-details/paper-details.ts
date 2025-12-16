import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaperService } from '../../../services/paper';
import { ReviewService } from '../../../services/review';
import { ConferenceService } from '../../../services/conference';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-paper-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paper-details.html',
  styleUrl: './paper-details.css'
})
export class PaperDetails implements OnInit {

  paperId: any;
  paper: any = null;
  review: any = null;
  conference: any = null;
  isLoading: boolean = true;
  currentUserRole: string = '';
  isConference: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paperService: PaperService,
    private reviewService: ReviewService,
    private conferenceService: ConferenceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.paperId = this.route.snapshot.paramMap.get('id');

    // Get current user role
    const user = this.authService.getLoggedUser();
    if (user) {
      this.currentUserRole = user.role;
    }

    // Check if this is conference details or paper details
    const url = this.router.url;
    this.isConference = url.includes('conference-details');

    if (this.isConference) {
      this.loadConferenceDetails();
    } else {
      this.loadData();
    }
  }

  loadData() {
    this.isLoading = true;

    // 1. Fetch paper details
    this.paperService.getPaperById(this.paperId).subscribe((data: any) => {
      this.paper = data;

      // 2. Fetch reviews
      this.reviewService.getReviewsByPaperId(this.paperId).subscribe((reviews: any[]) => {
        // Take the first review found (or improve logic if multiple reviews)
        this.review = reviews.length > 0 ? reviews[0] : null;
        this.isLoading = false;
      });
    });
  }

  loadConferenceDetails() {
    this.isLoading = true;

    this.conferenceService.getConferenceById(this.paperId).subscribe(data => {
      this.conference = data;
      this.isLoading = false;
    });
  }

  goBack() {
    // Navigate back based on user role
    if (this.currentUserRole === 'Author') {
      this.router.navigate(['/dashboard/my-submissions']);
    } else if (this.currentUserRole === 'Admin') {
      this.router.navigate(['/dashboard/conferences']);
    } else {
      this.router.navigate(['/dashboard/reviews']);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Accepted': return 'bg-success text-white';
      case 'Rejected': return 'bg-danger text-white';
      case 'Reviewed': return 'bg-info text-white';
      case 'Registered': return 'bg-success text-white';
      default: return 'bg-secondary text-white';
    }
  }

  isAuthor() {
    return this.currentUserRole === 'Author';
  }

  isAdmin() {
    return this.currentUserRole === 'Admin';
  }

  isReviewer() {
    return this.currentUserRole === 'Reviewer';
  }

  joinConference() {
    if (this.conference) {
      const user = this.authService.getLoggedUser();

      if (user) {
        const registrationData = {
          conferenceId: this.conference.id,
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          registrationDate: new Date(),
          status: 'Registered'
        };

        this.conferenceService.createRegistration(registrationData).subscribe(response => {
          if (response.success) {
            alert('Anda telah berjaya mendaftar untuk conference!');
            this.loadConferenceDetails();
          } else {
            alert('Ralat berlaku semasa mendaftar. Sila cuba lagi.');
          }
        });
      }
    }
  }

  editConference() {
    if (this.conference) {
      this.router.navigate(['/dashboard/edit-conference', this.conference.id]);
    }
  }

  deleteConference() {
    if (this.conference && confirm('Are you sure you want to delete this conference?')) {
      this.conferenceService.deleteConference(this.conference.id).subscribe(() => {
        this.router.navigate(['/dashboard/conferences']);
      });
    }
  }
}
