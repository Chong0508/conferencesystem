import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Usually needed
import { AuthService } from '../../../services/auth.service';
import { ApplicationService } from '../../../services/application';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile implements OnInit {

  loggedUser: any = null;

  constructor(
    private authService: AuthService,
    private appService: ApplicationService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.loggedUser = this.authService.getLoggedUser();
  }

  // --- Feature: Apply for Reviewer Role ---
  applyForReviewer() {
    // 1. Validation: Check if user is already a Reviewer or Admin
    if (this.loggedUser.role === 'Reviewer' || this.loggedUser.role === 'Admin') {
      alert('You are already a Reviewer/Admin!');
      return;
    }

    // 2. Prompt for a reason (Simple interaction)
    const reason = prompt("Why do you want to become a reviewer? (Optional)");

    // 3. If user clicked "OK" (not Cancel)
    if (reason !== null) {
      this.appService.applyForReviewer(this.loggedUser, reason).subscribe((res: any) => {
        if (res.success) {
          alert('Application submitted successfully! Please wait for Admin approval.');
        } else {
          // e.g., if they already have a pending application
          alert(res.message);
        }
      });
    }
  }

}
