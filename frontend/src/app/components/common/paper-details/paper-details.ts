import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
// 👇 Import Services
import { PaperService } from '../../../services/paper';
import { ReviewService } from '../../../services/review';

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
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paperService: PaperService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.paperId = this.route.snapshot.paramMap.get('id');
    this.loadData();
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

  goBack() {
    // Ideally check role to decide where to go back
    this.router.navigate(['/dashboard/my-submissions']);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Accepted': return 'bg-success text-white';
      case 'Rejected': return 'bg-danger text-white';
      case 'Reviewed': return 'bg-info text-white';
      case 'Registered': return 'bg-success text-white'; // Added
      default: return 'bg-secondary text-white';
    }
  }
}
