import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
// 👇 Import Services
import { PaperService } from '../../../services/paper';
import { AuthService } from '../../../services/auth';

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

  constructor(
    private router: Router,
    private paperService: PaperService, // 👈 Inject PaperService
    private authService: AuthService    // 👈 Inject AuthService
  ) {}

  ngOnInit() {
    this.loadMyPapers();
  }

  loadMyPapers() {
    this.isLoading = true;

    // 1. Get current logged-in user from AuthService
    const currentUser = this.authService.getLoggedUser();

    // 2. Fetch all papers from Service
    this.paperService.getAllPapers().subscribe((allPapers: any[]) => {

      // 3. Filter: Show only papers belonging to the current user
      if (currentUser && currentUser.email) {
        this.myPapers = allPapers.filter((p: any) => p.authorEmail === currentUser.email);
      } else {
        this.myPapers = [];
      }

      this.isLoading = false;
    });
  }

  // Helper function to return CSS classes based on status
  getStatusClass(status: string): string {
    switch (status) {
      case 'Accepted': return 'bg-success-subtle text-success border-success';
      case 'Rejected': return 'bg-danger-subtle text-danger border-danger';
      case 'Revision': return 'bg-warning-subtle text-warning border-warning';
      case 'Reviewed': return 'bg-info-subtle text-info border-info';
      case 'Registered': return 'bg-success text-white border-0 shadow-sm';
      default: return 'bg-light text-secondary border-secondary';
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
