import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  // Filter
  statusFilter: string = 'All';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadPapers();
  }

  loadPapers() {
    setTimeout(() => {
      // 1. Get all papers from Mock DB
      this.allPapers = JSON.parse(localStorage.getItem('mock_papers') || '[]');
      this.applyFilter();
      this.isLoading = false;
    }, 500);
  }

  // Filter Logic
  applyFilter() {
    if (this.statusFilter === 'All') {
      this.filteredPapers = this.allPapers;
    } else {
      this.filteredPapers = this.allPapers.filter(p => p.status === this.statusFilter);
    }
  }

  // Helper for Status Color
  getStatusClass(status: string): string {
    switch (status) {
      case 'Accepted': return 'bg-success-subtle text-success border-success';
      case 'Rejected': return 'bg-danger-subtle text-danger border-danger';
      case 'Revision': return 'bg-warning-subtle text-warning border-warning';
      case 'Reviewed': return 'bg-info-subtle text-info border-info';
      case 'Registered': return 'bg-success text-white';
      default: return 'bg-light text-secondary border-secondary';
    }
  }

  // --- Admin Actions ---

  // 1. Accept Paper (This enables Registration for Author)
  acceptPaper(paper: any) {
    if (confirm(`Are you sure you want to ACCEPT "${paper.title}"?`)) {
      this.updateStatus(paper.id, 'Accepted');
    }
  }

  // 2. Reject Paper
  rejectPaper(paper: any) {
    if (confirm(`Are you sure you want to REJECT "${paper.title}"?`)) {
      this.updateStatus(paper.id, 'Rejected');
    }
  }

  // 3. Delete Paper (Cleanup)
  deletePaper(paperId: number) {
    if (confirm("⚠️ Warning: This will permanently delete the paper. Continue?")) {
      this.allPapers = this.allPapers.filter(p => p.id !== paperId);
      this.filteredPapers = this.filteredPapers.filter(p => p.id !== paperId);
      localStorage.setItem('mock_papers', JSON.stringify(this.allPapers));
    }
  }

  // View Details (Reuse Author's detail page or Reviewer's)
  viewDetails(paperId: number) {
    // For Admin, we can reuse the Paper Details page
    this.router.navigate(['/dashboard/paper-details', paperId]);
  }

  // Internal Helper to save status
  updateStatus(id: number, newStatus: string) {
    const index = this.allPapers.findIndex(p => p.id === id);
    if (index !== -1) {
      this.allPapers[index].status = newStatus;
      localStorage.setItem('mock_papers', JSON.stringify(this.allPapers));
      this.applyFilter(); // Refresh list
    }
  }
}
