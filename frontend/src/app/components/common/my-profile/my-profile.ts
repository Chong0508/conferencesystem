import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

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
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  // Function to combine names for display
  getFullName(): string {
    if (!this.loggedUser) return 'N/A';
    const first = this.loggedUser.firstName || '';
    const last = this.loggedUser.lastName || '';
    const combined = `${first} ${last}`.trim();
    return combined.length > 0 ? combined : 'N/A';
  }

  loadUserProfile() {
    this.isLoading = true;
    const sessionUser = this.authService.getLoggedUser();
    
    // User ID logic remains unchanged as requested
    if (sessionUser && sessionUser.userId) {
      this.http.get<any>(`${environment.apiUrl}/users/${sessionUser.userId}`).subscribe({
        next: (fullUser) => {
          this.loggedUser = {
            // Mapping keys to match what getFullName() expects
            firstName: fullUser.firstName || fullUser.first_name || '',
            lastName: fullUser.lastName || fullUser.last_name || '',
            email: fullUser.email,
            role: fullUser.role || fullUser.category,
            userId: fullUser.userId || fullUser.user_id // Preserving ID logic
          };
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Could not fetch full profile', err);
          this.loggedUser = sessionUser;
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  applyForReviewer() {
    const role = this.loggedUser?.role;
    if (role === 'Reviewer' || role === 'Admin' || role === 'Super Admin') {
      alert('You already have advanced privileges!');
      return;
    }
    this.router.navigate(['/dashboard/apply-reviewer']);
  }
}