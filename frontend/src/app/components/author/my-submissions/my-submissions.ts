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
    const user = this.authService.getLoggedUser();
    const userId = user?.user_id || user?.userId || user?.id;

    if (!userId) {
      console.error('No User ID found');
      this.router.navigate(['/login']);
      return;
    }

    this.paperService.getPapersByAuthor(Number(userId)).subscribe({
      next: (data: any[]) => {
        this.myPapers = data || [];
        console.log('Author papers:', this.myPapers);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading papers:', err);
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Accepted': return 'bg-success-subtle text-success border-success';
      case 'Rejected': return 'bg-danger-subtle text-danger border-danger';
      case 'Revised': case 'Reviewed': return 'bg-info-subtle text-info border-info';
      case 'Registered': return 'bg-primary-subtle text-primary border-primary';
      default: return 'bg-warning-subtle text-warning border-warning';
    }
  }

  viewDetails(paper: any) {
    console.log('Navigating to paper:', paper.paperId);
    this.router.navigate(['/dashboard/paper-details', paper.paperId]);
  }

  editPaper(paper: any) {
    this.router.navigate(['/dashboard/submit-paper'], { queryParams: { edit: paper.paperId } });
  }

  onDelete(id: number) {
    if (confirm('Delete this paper?')) {
      this.paperService.deletePaper(id).subscribe({
        next: () => {
          this.myPapers = this.myPapers.filter(p => p.paperId !== id);
          alert('Paper deleted');
        },
        error: (err) => alert('Delete failed: ' + err.error?.message)
      });
    }
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
