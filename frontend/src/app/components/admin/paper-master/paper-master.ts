import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaperService } from '../../../services/paper.service'; // Ensure this service is imported
import { HttpClient } from '@angular/common/http';

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
    private paperService: PaperService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadPapers();
  }

  loadPapers() {
    this.isLoading = true;
    // 1. Fetch from your Real Backend Controller
    this.paperService.getAllPapers().subscribe({
      next: (data) => {
        this.allPapers = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching papers from backend:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    if (this.statusFilter === 'All') {
      this.filteredPapers = this.allPapers;
    } else {
      this.filteredPapers = this.allPapers.filter(p => p.status === this.statusFilter);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Accepted': return 'bg-success-subtle text-success border-success';
      case 'Rejected': return 'bg-danger-subtle text-danger border-danger';
      case 'Revised': return 'bg-warning-subtle text-warning border-warning';
      case 'Reviewed': return 'bg-info-subtle text-info border-info';
      case 'Registered': return 'bg-success text-white';
      case 'Pending Review': return 'bg-secondary-subtle text-secondary border-secondary';
      default: return 'bg-light text-secondary border-secondary';
    }
  }

  // Admin Decision: Accept
  acceptPaper(paper: any) {
    if (confirm(`Accept "${paper.title}"? This allows the author to pay the publication fee.`)) {
      this.updateStatusOnBackend(paper.paperId, 'Accepted');
    }
  }

  // Admin Decision: Reject
  rejectPaper(paper: any) {
    if (confirm(`Reject "${paper.title}"?`)) {
      this.updateStatusOnBackend(paper.paperId, 'Rejected');
    }
  }

  // Admin Decision: Delete
  deletePaper(paperId: number) {
    if (confirm("⚠️ Permanently delete this paper and its file from the server?")) {
      this.paperService.deletePaper(paperId).subscribe({
        next: () => {
          this.allPapers = this.allPapers.filter(p => p.paperId !== paperId);
          this.applyFilter();
        },
        error: (err) => alert("Delete failed: " + err.message)
      });
    }
  }

  viewDetails(paperId: number) {
    this.router.navigate(['/dashboard/paper-details', paperId]);
  }

  // PERSISTENCE: Save status change to the real MySQL Database
  updateStatusOnBackend(id: number, newStatus: string) {
    // You can add a specific PATCH endpoint in your backend or use the existing update logic
    this.http.put(`http://localhost:8080/api/papers/${id}/status`, { status: newStatus }).subscribe({
      next: () => {
        const index = this.allPapers.findIndex(p => p.paperId === id);
        if (index !== -1) {
          this.allPapers[index].status = newStatus;
          this.applyFilter();
        }
      },
      error: (err) => console.error("Failed to update status", err)
    });
  }
}