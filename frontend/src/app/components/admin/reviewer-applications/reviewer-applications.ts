import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// 👇 Import: This path works if you renamed 'application.ts' to 'application.service.ts'
import { ApplicationService, ReviewerApplication } from '../../../services/application';

@Component({
  selector: 'app-reviewer-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviewer-applications.html',
  styleUrls: ['./reviewer-applications.css']
})
export class ReviewerApplicationsComponent implements OnInit {

  // Initialize variables to avoid "Unresolved variable" errors in HTML
  applications: ReviewerApplication[] = [];
  isLoading: boolean = true;

  constructor(private appService: ApplicationService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    // 👇 Fix TS7006: Explicitly type 'data' as ReviewerApplication array
    this.appService.getApplications().subscribe((data: ReviewerApplication[]) => {
      this.applications = data;
      this.isLoading = false;
    });
  }

  getEvidenceUrl(path: string | undefined): string {
    if (!path) return '#';
    // Extracts the filename from the backend path (e.g., 'evidence_3_123.pdf')
    const fileName = path.split('/').pop();
    return `http://localhost:8080/users/applications/evidence/${fileName}`;
  }

  process(appId: number, status: 'Approved' | 'Rejected') {
    if (confirm(`Are you sure you want to ${status} this application?`)) {
      this.appService.processApplication(appId, status).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => {
          console.error('Process failed', err);
          alert('Failed to process application');
        }
      });
    }
  }
}
