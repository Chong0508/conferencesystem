import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-admin.html',
  styleUrls: ['./create-admin.css']
})
export class CreateAdminComponent {
  adminData = {
    firstName: '',
    lastName: '',
    email: '',
    password_hash: '', 
    category: 'Admin'
  };

  message = '';
  isError = false;
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.message = '';
    
    // Using the specific admin creation endpoint
    this.http.post(`${environment.apiUrl}/users/admin`, this.adminData)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.isError = false;
          this.message = 'Admin account created successfully!';
          setTimeout(() => this.router.navigate(['/dashboard/user-management']), 2000);
        },
        error: (err) => {
          this.isLoading = false;
          this.isError = true;
          // Capture the clear error message from our backend
          this.message = err.error.message || 'An error occurred during registration.';
        }
      });
  }
}