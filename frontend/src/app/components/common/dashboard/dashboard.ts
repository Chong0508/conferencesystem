import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  loggedUser: any = {
    firstName: 'Guest',
    lastName: '',
    role: 'Guest',
    avatarColor: 'cccccc'
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    const user = this.authService.getLoggedUser();

    if (user) {
      this.loggedUser = user;
      console.log('Current Dashboard User:', this.loggedUser.role); // Debugging line
    } else {
      // If not logged in, redirect to login
      this.router.navigate(['/login']);
    }
  }

  onLogout() {
    // Optional: You can add a logout method in AuthService too
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
