import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaperService } from '../../../services/paper.service';
import { ReviewService } from '../../../services/review.service';

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
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paperService: PaperService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    // Get the Paper ID from URL
    this.paperId = this.route.snapshot.paramMap.get('id');
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.errorMessage = '';

    // Fetch paper details from backend
     this.paperService.getPaperById(this.paperId).subscribe({
        next: (paperData) => {
          this.paper = paperData;

          // ✅ 2. Fetch reviews for this paper
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
        console.error('Error fetching paper:', err);
        this.errorMessage = 'Failed to load paper details';
        this.isLoading = false;
      }
    });
  }

  // Navigate back to the list
  goBack() {
    this.router.navigate(['/dashboard/my-submissions']);
  }

  // Helper to get CSS class based on status
  getStatusClass(status: string): string {
    switch (status) {
      case 'Accepted': return 'bg-success text-white';
      case 'Rejected': return 'bg-danger text-white';
      case 'Reviewed': return 'bg-info text-white';
      default: return 'bg-secondary text-white'; // Pending
    }
  }

  // 1. New method to get the URL (Consistent with Grading/Reviewer App)
  getManuscriptUrl(fileName: string | undefined): string {
    if (!fileName) return '#';
    return `http://localhost:8080/api/papers/download/${fileName}`;
  }

  // 2. Updated clean file name logic
  getCleanFileName(fullPath: string | undefined): string {
    if (!fullPath) return 'Manuscript.pdf';
    // Extracts name after the timestamp prefix (e.g., 17349_paper.pdf -> paper.pdf)
    const parts = fullPath.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : fullPath;
  }
}
