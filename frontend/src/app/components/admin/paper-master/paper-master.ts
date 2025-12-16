import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// 👇 Fixed Imports: No .service suffix
import { PaperService } from '../../../services/paper';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-paper-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paper-master.html',
  styleUrl: './paper-master.css'
})
export class PaperMaster implements OnInit {

  allPapers: any[] = [];
  filteredPapers: any[] = [];
  isLoading: boolean = true;

  // add and save reviewers
  reviewers: any[] = [];

  // Filter
  statusFilter: string = 'All';

  constructor(
    private router: Router,
    private paperService: PaperService, // 👈 Inject PaperService
    private userService: UserService    // 👈 Inject UserService
  ) {}

  ngOnInit() {
    this.loadPapers();
    this.loadReviewers();
  }

  loadPapers() {
    this.isLoading = true;
    // 👇 Fixed: Added type (data: any[]) to avoid implicit any error
    this.paperService.getAllPapers().subscribe((data: any[]) => {
      this.allPapers = data;
      this.applyFilter();
      this.isLoading = false;
    });
  }

  // Load Reviewer name list
  loadReviewers() {
    // 👇 Fixed: Added type (users: any[])
    this.userService.getAllUsers().subscribe((users: any[]) => {
      // choosing role is Reviewer user
      this.reviewers = users.filter((u: any) => u.role === 'Reviewer');
    });
  }

  // Filter Logic
  applyFilter() {
    if (this.statusFilter === 'All') {
      this.filteredPapers = this.allPapers;
    } else {
      this.filteredPapers = this.allPapers.filter(p => p.status === this.statusFilter);
    }
  }

  // Helper for Status Color (Used in HTML)
  getStatusClass(status: string): string {
    switch (status) {
      case 'Accepted': return 'bg-success-subtle text-success border-success';
      case 'Rejected': return 'bg-danger-subtle text-danger border-danger';
      case 'Revision': return 'bg-warning-subtle text-warning border-warning';
      case 'Reviewed': return 'bg-info-subtle text-info border-info';
      case 'Registered': return 'bg-success text-white';
      case 'Under Review': return 'bg-primary-subtle text-primary border-primary';
      default: return 'bg-light text-secondary border-secondary';
    }
  }

  // --- Admin Actions ---

  assignReviewer(paper: any) {
    if (paper.status === 'Pending Review') {
      paper.status = 'Under Review';
    }

    // Use Service to update paper (save assigned reviewer)
    this.paperService.updatePaper(paper).subscribe(() => {
      this.applyFilter();
    });
  }

  // 1. Accept Paper
  acceptPaper(paper: any) {
    if (confirm(`Are you sure you want to ACCEPT "${paper.title}"?`)) {
      paper.status = 'Accepted';
      this.updateStatus(paper);
    }
  }

  // 2. Reject Paper
  rejectPaper(paper: any) {
    if (confirm(`Are you sure you want to REJECT "${paper.title}"?`)) {
      paper.status = 'Rejected';
      this.updateStatus(paper);
    }
  }

  // 3. Delete Paper
  deletePaper(paperId: number) {
    if (confirm("⚠️ Warning: This will permanently delete the paper. Continue?")) {
      // Use Service to delete
      this.paperService.deletePaper(paperId).subscribe(() => {
        this.loadPapers(); // Refresh list
      });
    }
  }

  // View Details
  viewDetails(paperId: number) {
    this.router.navigate(['/dashboard/paper-details', paperId]);
  }

  // Internal Helper to save status
  updateStatus(paper: any) {
    this.paperService.updatePaper(paper).subscribe(() => {
      this.applyFilter();
    });
  }
}
