import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService, ReviewerApplication } from '../../../services/application';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-reviewer-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviewer-applications.html',
  styleUrls: ['./reviewer-applications.css']
})
export class ReviewerApplicationsComponent implements OnInit {
  applications: ReviewerApplication[] = [];
  isLoading: boolean = true;

  constructor(
    private appService: ApplicationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.appService.getApplications().subscribe({
      next: (data) => {
        console.log('Applications loaded:', data);
        this.applications = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load applications:', err);
        this.isLoading = false;
      }
    });
  }

  getEvidenceUrl(path: string | undefined): string {
    if (!path) return '#';
    const fileName = path.split('/').pop();
    return `http://localhost:8080/users/applications/evidence/${fileName}`;
  }

  process(appId: number, status: 'Approved' | 'Rejected') {
    // Find the application first so we know who to notify
    const targetApp = this.applications.find(a => a.id === appId);

    if (confirm(`Are you sure you want to ${status} this application?`)) {
      this.appService.processApplication(appId, status).subscribe({
        next: () => {

          // ============================================================
          // 3. TRIGGER NOTIFICATION
          // ============================================================
          if (targetApp && targetApp.userId) {
            let msg = '';
            let type = 'info';

            if (status === 'Approved') {
              msg = `Congratulations! Your application to become a Reviewer has been Approved.`;
              type = 'success';
            } else {
              msg = `Your application to become a Reviewer has been Rejected.`;
              type = 'error';
            }

            this.notificationService.createNotification(
              Number(targetApp.userId),
              msg,
              type
            );
          } else {
             console.warn('Applicant ID not found, skipping notification.');
          }

          alert(`Application ${status} successfully!`);
          this.loadData();
        },
        error: (err) => {
          console.error('Process failed:', err);
          alert('Failed: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }
}
