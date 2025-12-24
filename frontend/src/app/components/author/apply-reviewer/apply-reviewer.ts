import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // Added missing import
import { Router } from '@angular/router'; // Added Router
import { FormsModule } from '@angular/forms'; // Needed if you use ngModel in HTML
import { AuthService } from '../../../services/auth.service'; // Added to get user data

@Component({
  selector: 'app-apply-reviewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply-reviewer.html',
  styleUrl: './apply-reviewer.css',
})
export class ApplyReviewerComponent implements OnInit {
  // 1. Declare properties to fix "does not exist" errors
  appData = { educationLevel: 'Master', reason: '' };
  selectedFile: File | null = null;
  isLoading = false;
  loggedUser: any;

  // 2. Inject services via constructor
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.loggedUser = this.authService.getLoggedUser();
  }

  ngOnInit() {
    // 3. Initialize loggedUser on startup
    this.loggedUser = this.authService.getLoggedUser();
    if (!this.loggedUser) {
      console.error('User session not found.');
      this.router.navigate(['/login']);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
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

    this.http.post('http://localhost:8080/users/apply-reviewer', formData).subscribe({
      next: () => {
        alert('Submitted successfully!');
        this.router.navigate(['/dashboard/profile']);
      },
      error: (err) => {
        this.isLoading = false;
        alert('Error: ' + (err.error?.message || 'Server connection failed.'));
      }
    });
  }
}
