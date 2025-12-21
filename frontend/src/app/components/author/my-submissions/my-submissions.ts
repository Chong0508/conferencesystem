import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PaperService } from '../../../services/paper.service';
import { AuthService } from '../../../services/auth.service';

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
  constructor(private router: Router, private paperService: PaperService, private authService: AuthService) {}

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
      case 'Accepted': return 'bg-success-subtle text-success border-success'; // Green
      case 'Rejected': return 'bg-danger-subtle text-danger border-danger';   // Red
      case 'Revision': return 'bg-warning-subtle text-warning border-warning'; // Yellow
      case 'Reviewed': return 'bg-info-subtle text-info border-info';          // Blue
      case 'Registered': return 'bg-success text-white border-0 shadow-sm';    // Solid Green (Paid)
      default: return 'bg-light text-secondary border-secondary';              // Grey (Pending)
    }
  }

  // Navigate to Paper Details page
  viewDetails(paper: any) {
    this.router.navigate(['/dashboard/paper-details', paper.paperId]);
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
