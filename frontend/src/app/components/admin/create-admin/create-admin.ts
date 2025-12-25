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

  adminData = {
    firstName: '',
    lastName: '',
    email: '',
    password_hash: ''
  };

  message = '';
  isError = false;
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.isLoading = true;

    const payload = {
      first_name: this.adminData.firstName,
      last_name: this.adminData.lastName,
      email: this.adminData.email,
      password_hash: this.adminData.password_hash,
      category: 'Admin'
    };

    this.http.post('http://localhost:8080/users/admin', payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.message = 'Admin created successfully!';
        this.router.navigate(['/dashboard/user-management']);
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.message = err.error?.message || 'Error creating admin';
      }
    });
  }
}
