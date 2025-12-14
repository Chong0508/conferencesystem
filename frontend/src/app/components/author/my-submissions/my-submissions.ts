import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Ensure RouterLink is imported

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
  constructor(private router: Router) {}

  ngOnInit() {
    this.loadMyPapers();
  }

  loadMyPapers() {
    // Simulate network delay
    setTimeout(() => {
      // 1. Get current logged-in user
      const currentUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');

      // 2. Fetch all papers from mock database (LocalStorage)
      const allPapers = JSON.parse(localStorage.getItem('mock_papers') || '[]');

      // 3. Filter: Show only papers belonging to the current user
      if (currentUser.email) {
        this.myPapers = allPapers.filter((p: any) => p.authorEmail === currentUser.email);
      }

      this.isLoading = false;
    }, 500);
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
    this.router.navigate(['/dashboard/paper-details', paper.id]);
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
