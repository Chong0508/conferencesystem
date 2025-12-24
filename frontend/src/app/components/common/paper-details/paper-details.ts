import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaperService } from '../../../services/paper.service';
import { ReviewService } from '../../../services/review.service';
import { ConferenceService } from '../../../services/conference.service'; // Injected

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
  conferenceName: string = 'Loading...'; // Added variable
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paperService: PaperService,
    private reviewService: ReviewService,
    private confService: ConferenceService // Injected
  ) {}

  ngOnInit() {
    this.paperId = this.route.snapshot.paramMap.get('id');
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    
    this.paperService.getPaperById(this.paperId).subscribe({
      next: (paperData) => {
        this.paper = paperData;

        // ✅ 1. Fetch Conference Name using conferenceId from paper
        if (this.paper.conferenceId) {
          this.confService.getConferenceById(this.paper.conferenceId).subscribe({
            next: (conf) => this.conferenceName = conf.title || conf.name,
            error: () => this.conferenceName = 'Unknown Conference'
          });
        } else {
          this.conferenceName = 'Not Assigned';
        }

        // ✅ 2. Fetch reviews
        this.reviewService.getReviewsByPaper(this.paperId).subscribe({
          next: (reviews) => {
            this.review = reviews && reviews.length > 0 ? reviews[0] : null;
            this.isLoading = false;
          },
          error: () => {
            this.review = null;
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Failed to load paper details';
        this.isLoading = false;
      }
    });
  }

  goBack() { this.router.navigate(['/dashboard/my-submissions']); }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Accepted': return 'bg-success text-white';
      case 'Rejected': return 'bg-danger text-white';
      case 'Reviewed': return 'bg-info text-white';
      default: return 'bg-secondary text-white';
    }
  }

  getManuscriptUrl(fileName: string | undefined): string {
    if (!fileName) return '#';
    return `http://localhost:8080/api/papers/download/${fileName}`;
  }

  getCleanFileName(fullPath: string | undefined): string {
    if (!fullPath) return 'Manuscript.pdf';
    const parts = fullPath.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : fullPath;
  }
}