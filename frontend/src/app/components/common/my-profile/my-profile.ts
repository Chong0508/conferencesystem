import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  // Properties declared to prevent TS2339 error
  loggedUser: any = null;
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private appService: ApplicationService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading = true;
    
    // Attempt to fetch user from AuthService
    const user = this.authService.getLoggedUser();
    
    if (user) {
      this.loggedUser = user;
    } else {
      console.error('User session not found.');
    }

    this.isLoading = false;
  }

  applyForReviewer() {
    if (this.loggedUser?.role === 'Reviewer' || this.loggedUser?.role === 'Admin') {
      alert('You are already a Reviewer/Admin!');
      return;
    }

    const reason = prompt("Why do you want to become a reviewer? (e.g., expertise, field of study)");

    if (reason !== null) {
      this.isLoading = true;
      this.appService.applyForReviewer(this.loggedUser, reason).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            alert('Application submitted! Pending admin approval.');
          } else {
            alert(res.message || 'Submission failed.');
          }
        },
        error: (err) => {
          this.isLoading = false;
          alert('Error connecting to server.');
          console.error(err);
        }
      });
    }
  }
}