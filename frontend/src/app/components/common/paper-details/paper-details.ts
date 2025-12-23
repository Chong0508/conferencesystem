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

downloadManuscript() {
  if (!this.paperId) return;

  this.isLoading = true; // Show spinner while downloading

  this.paperService.downloadPaper(this.paperId).subscribe({
    next: (blob: Blob) => {
      // Create a local URL for the binary data
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      // Set the download attributes
      a.href = url;
      // Get a clean name like "Assignment_2.pdf" instead of the full server path
      a.download = this.getCleanFileName(this.paper.fileName);
      
      // Trigger the download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup: remove the temporary element and URL
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Download failed:', err);
      alert('Could not download file. The file might be missing on the server.');
      this.isLoading = false;
    }
  });
}

// Helper to strip the /app/uploads/papers/ prefix for the save dialog
getCleanFileName(fullPath: string): string {
  if (!fullPath) return 'manuscript.pdf';
  return fullPath.split('_').pop() || 'manuscript.pdf';
}
}
