import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-paper-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paper-details.html',
  styleUrl: './paper-details.css'
})
export class PaperDetails implements OnInit {

  paperId: any;
  paper: any = null;   // To store paper metadata
  review: any = null;  // To store reviewer's feedback
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // 1. Get the Paper ID from the URL (e.g., /dashboard/paper-details/123)
    this.paperId = this.route.snapshot.paramMap.get('id');
    this.loadData();
  }

  loadData() {
    setTimeout(() => {
      // 2. Fetch paper details from LocalStorage (Mock DB)
      const allPapers = JSON.parse(localStorage.getItem('mock_papers') || '[]');
      this.paper = allPapers.find((p: any) => p.id == this.paperId);

      // 3. Fetch review data for this specific paper (if it exists)
      const allReviews = JSON.parse(localStorage.getItem('mock_reviews') || '[]');
      this.review = allReviews.find((r: any) => r.paperId == this.paperId);

      this.isLoading = false;
    }, 500);
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
}
