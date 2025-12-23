import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PaperService } from '../../../services/paper.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-submissions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-submissions.html',
  styleUrl: './my-submissions.css'
})
export class MySubmissions implements OnInit {

  myPapers: any[] = [];
  isLoading: boolean = true;

  // Inject Router for navigation
  constructor(private router: Router, private paperService: PaperService, private http: HttpClient,private authService: AuthService) {}

  ngOnInit() {
    this.loadMyPapers();
  }

  loadMyPapers() {
      this.isLoading = true;

      // 3. Get the current user from your AuthService
      const user = this.authService.getCurrentUser();
      const userId = user?.userId || user?.user_id || user?.id;

      if (!userId) {
        console.error('No User ID found, redirecting to login');
        this.router.navigate(['/login']);
        return;
      }

      // 4. Call the Backend via PaperService
      this.paperService.getAllPapers().subscribe({
        next: (data: any[]) => {
          this.myPapers = (data || []).filter(
            p => p.authorId === Number(userId)
          );
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });

    }

  // Helper function to return CSS classes based on status
  getStatusClass(status: string): string {
    switch (status) {
      case 'Accepted':
        return 'bg-success-subtle text-success border-success';
      case 'Rejected':
        return 'bg-danger-subtle text-danger border-danger';
      case 'Revised':
      case 'Reviewed':
        return 'bg-info-subtle text-info border-info';
      case 'Registered':
        return 'bg-primary-subtle text-primary border-primary';
      case 'Pending Review':
      default:
        return 'bg-warning-subtle text-warning border-warning';
    }
  }

  // Navigate to Paper Details page
  viewDetails(paper: any) {
    this.router.navigate(['/dashboard/paper-details', paper.paperId]);
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      this.http.delete(`http://localhost:8080/api/papers/${id}`).subscribe({
        next: () => {
          alert('Submission deleted successfully');
          this.loadMyPapers(); // Refresh the list
        },
        error: (err) => {
          console.error('Delete failed', err);
          alert('Could not delete the paper.');
        }
      });
    }
  }

  // Logic to edit a paper (Redirects to submission page with ID)
  editPaper(paper: any) {
    // You can use the same submit-paper component but pass the ID to "edit mode"
    this.router.navigate(['/dashboard/submit-paper'], { queryParams: { edit: paper.paperId } });
  }

  // View Receipt (Only for Registered papers)
  viewReceipt(paper: any) {
    if (paper.status !== 'Registered') return;

    // Generate mock receipt data
    const receiptId = 'RCPT-' + paper.id + '-' + Math.floor(Math.random() * 1000);
    const date = new Date().toLocaleDateString();
    const amount = '150.00';

    // Show receipt in an alert (You can upgrade this to a modal later)
    alert(
      `🧾 OFFICIAL RECEIPT\n` +
      `--------------------------------\n` +
      `Receipt ID: ${receiptId}\n` +
      `Date: ${date}\n` +
      `Paper ID: #${paper.trackId}\n` +
      `Paper Title: ${paper.title}\n` +
      `--------------------------------\n` +
      `Total Paid: $${amount}\n` +
      `Payment Status: SUCCESSFUL ✅\n` +
      `--------------------------------\n` +
      `Thank you for registering with G5ConfEase!`
    );
  }
}
