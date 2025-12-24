import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ApplicationService } from '../../../services/application';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-apply-reviewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply-reviewer.html',
  styleUrl: './apply-reviewer.css',
})
export class ApplyReviewerComponent implements OnInit {
  appData = { educationLevel: 'Master', reason: '' };
  selectedFile: File | null = null;
  isLoading = false;
  loggedUser: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private appService: ApplicationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loggedUser = this.authService.getLoggedUser();
    if (!this.loggedUser) {
      this.router.navigate(['/login']);
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  submitApplication() {
    if (!this.selectedFile) return alert('Please upload PDF evidence.');
    if (!this.loggedUser) return alert('User session expired. Please log in again.');

    // Ensure we have a valid ID (handle variations like id vs userId)
    const userId = this.loggedUser.userId || this.loggedUser.id || this.loggedUser.user_id;

    if (!userId) {
      alert("Error: User ID not found. Please re-login.");
      return;
    }

    this.isLoading = true;
    const formData = new FormData();

    formData.append('userId', userId);
    formData.append('educationLevel', this.appData.educationLevel);
    formData.append('reason', this.appData.reason);
    formData.append('evidence', this.selectedFile);

    this.appService.submitReviewerApplication(formData).subscribe({
      next: () => {

        // ============================================================
        // 3. TRIGGER NOTIFICATION
        // ============================================================
        this.notificationService.createNotification(
          Number(userId),
          'Your reviewer application has been submitted successfully.',
          'success'
        );

        alert('Application submitted successfully! Waiting for admin approval.');
        this.router.navigate(['/dashboard/profile']);
      },
      error: (err) => {
        this.isLoading = false;
        alert('Error: ' + (err.error?.message || 'Server error. Check console.'));
        console.error('Submit error:', err);
      },
      complete: () => this.isLoading = false
    });
  }
}
