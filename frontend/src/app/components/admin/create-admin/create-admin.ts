import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-admin.html',
  styleUrls: ['./create-admin.css']
})
export class CreateAdminComponent {
  // Form model
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  message = '';
  isError = false;
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.message = '';
    
    // 1. Prepare payload to match Java Backend User model keys
    const payload = {
      first_name: this.formData.firstName,
      last_name: this.formData.lastName,
      email: this.formData.email,
      password_hash: this.formData.password, // Backend will BCrypt encode this
      category: 'Admin'
    };

    // 2. POST to the specific admin creation endpoint
    this.http.post('http://localhost:8080/users/admin', payload, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.isError = false;
          this.message = res.message || 'Admin account created successfully!';
          // Redirect to user management after success
          setTimeout(() => this.router.navigate(['/dashboard/user-management']), 2000);
        },
        error: (err) => {
          this.isLoading = false;
          this.isError = true;
          // Capture 'Email already registered' or other backend errors
          this.message = err.error?.message || err.error?.error || 'Registration failed.';
          console.error('Admin Creation Error:', err);
        }
      });
  }
}