import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 1. Import Router
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile implements OnInit {
  loggedUser: any = null;
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router // 2. Inject Router
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading = true;
    const user = this.authService.getLoggedUser();
    if (user) {
      this.loggedUser = user;
    }
    this.isLoading = false;
  }

  // 3. Updated method to redirect
  applyForReviewer() {
    if (this.loggedUser?.role === 'Reviewer' || this.loggedUser?.role === 'Admin' || this.loggedUser?.role === 'Super Admin') {
      alert('You already have Reviewer or Admin privileges!');
      return;
    }

    // Redirect to the route you defined in app.routes.ts
    this.router.navigate(['/dashboard/apply-reviewer']);
  }
}