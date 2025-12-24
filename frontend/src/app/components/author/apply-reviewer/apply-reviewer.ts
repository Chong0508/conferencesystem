import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // Added missing import
import { Router } from '@angular/router'; // Added Router
import { FormsModule } from '@angular/forms'; // Needed if you use ngModel in HTML
import { AuthService } from '../../../services/auth.service';
import {ApplicationService} from '../../../services/application'; // Added to get user data

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
    private appService: ApplicationService
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

    this.isLoading = true;
    const formData = new FormData();

    // 4. Using the properties now correctly defined above
    formData.append('userId', this.loggedUser.userId);

    formData.append('educationLevel', this.appData.educationLevel);
    formData.append('reason', this.appData.reason);
    formData.append('evidence', this.selectedFile);

    this.appService.submitReviewerApplication(formData).subscribe({
      next: () => {
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
