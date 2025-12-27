import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaperService } from '../../../services/paper.service';

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
  statusFilter: string = 'All';

  constructor(
    private router: Router, 
    private paperService: PaperService
  ) {}

  ngOnInit() {
    this.loadPapers();
  }

  loadPapers() {
    this.isLoading = true;
    this.paperService.getAllPapers().subscribe({
      next: (data) => {
        this.allPapers = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching papers:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    if (this.statusFilter === 'All') {
      this.filteredPapers = [...this.allPapers];
    } else {
      this.filteredPapers = this.allPapers.filter(p => p.status === this.statusFilter);
    }
  }

  // Admin Decision: Accept
  acceptPaper(paper: any) {
    if (confirm(`Accept "${paper.title}"?`)) {
      this.updateStatus(paper.paperId, 'Accepted');
    }
  }

  // Admin Decision: Reject
  rejectPaper(paper: any) {
    if (confirm(`Reject "${paper.title}"?`)) {
      this.updateStatus(paper.paperId, 'Rejected');
    }
  }

  private updateStatus(id: number, newStatus: string) {
    this.paperService.updatePaperStatus(id, newStatus).subscribe({
      next: () => {
        const index = this.allPapers.findIndex(p => p.paperId === id);
        if (index !== -1) {
          this.allPapers[index].status = newStatus;
          this.applyFilter();
        }
      },
      error: (err) => {
        // If this still gives "Unknown Error", it is a CORS issue in your Java Backend
        alert("Backend Error: Status update failed. Check if Backend is running.");
      }
    });
  }

  deletePaper(paperId: number) {
    if (confirm("⚠️ Permanently delete this paper?")) {
      this.isLoading = true;
      this.paperService.deletePaper(paperId).subscribe({
        next: () => {
          this.allPapers = this.allPapers.filter(p => p.paperId !== paperId);
          this.applyFilter();
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          alert("Delete failed: " + err.message);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Accepted': return 'bg-success-subtle text-success border-success';
      case 'Rejected': return 'bg-danger-subtle text-danger border-danger';
      case 'Registered': return 'bg-success text-white';
      default: return 'bg-light text-secondary border-secondary';
    }
  }

  viewDetails(paperId: number) {
    this.router.navigate(['/dashboard/paper-details', paperId]);
  }
}