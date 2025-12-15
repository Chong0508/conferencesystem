import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registerObj: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    affiliation: '',
    role: 'Author'
  };

  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  onRegister() {
    if (this.registerObj.password !== this.registerObj.confirmPassword) {
      alert("Error: Passwords do not match!");
      return;
    }

    if (this.registerObj.email && this.registerObj.password && this.registerObj.firstName) {
      this.isLoading = true;

      // Remove confirmPassword before sending
      const { confirmPassword, ...userData } = this.registerObj;

      this.authService.register(userData).subscribe({
        next: (res) => {
          this.isLoading = false;
          alert("Registration Successful! Please login with your new account.");
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          this.isLoading = false;
          alert("Registration failed. Please try again.");
        }
      });

    } else {
      alert("Please fill in all required fields.");
    }
  }
}
