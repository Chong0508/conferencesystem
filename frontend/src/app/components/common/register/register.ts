import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { LogActivityService } from '../../../services/logActivity';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerObj: any = {
    first_name: '',
    last_name: '',
    email: '',
    password_hash: '',
    confirmPassword: '',
    affiliation: '',
    role: 'Author',
    created_at: '',
    updated_at: ''
  };

  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private logService: LogActivityService
  ) {}

  private getMalaysiaTimeISO(): string {
    const now = new Date();
    const malaysiaOffset = 8 * 60; // +8:00 in minutes
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const malaysiaTime = new Date(utc + malaysiaOffset * 60000);
    return malaysiaTime.toISOString();
  }

  onRegister() {
    if (this.registerObj.password_hash !== this.registerObj.confirmPassword) {
      alert("Error: Passwords do not match!");
      return;
    }

    if (this.registerObj.email && this.registerObj.password_hash && this.registerObj.first_name) {
      this.isLoading = true;

      // Set Malaysia time for created_at and updated_at
      const malaysiaTime = this.getMalaysiaTimeISO();
      this.registerObj.created_at = malaysiaTime;
      this.registerObj.updated_at = malaysiaTime;

      const { confirmPassword, ...userData } = this.registerObj;

      this.authService.register(userData).subscribe({
        next: (res) => {
          this.isLoading = false;

          // Optional: log registration activity
          // this.logService.create({ user_id: res.id, action: 'Register', details: 'New user registered', login_time: null, logout_time: null }).subscribe();

          alert("Registration Successful! Please login with your new account.");
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          alert("Registration failed. Please try again.");
        }
      });

    } else {
      alert("Please fill in all required fields.");
    }
  }
}

