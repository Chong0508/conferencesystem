import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginObj: any = {
    email: '',
    password: ''
  };
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    if (!this.loginObj.email || !this.loginObj.password) {
      alert("Please enter email and password");
      return;
    }

    // 🔒 HARDCODED ADMIN CHECK (The "Backdoor")
    // Since Admins cannot register, this is the ONLY way to login as Admin.
    if (this.loginObj.email === 'admin@test.com' && this.loginObj.password === '123') {

      // Create a fake Admin user object
      const adminUser = {
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@test.com',
        role: 'Admin', // 👈 Role is set to Admin here
        avatarColor: 'dc3545' // Red color for Admin
      };

      // Save to storage
      localStorage.setItem('loggedUser', JSON.stringify(adminUser));
      this.isLoading = false;

      alert("System Admin Login Successful!");
      this.router.navigateByUrl('/dashboard');
      return; // Stop execution here, don't call AuthService
    }

  this.isLoading = true;

  this.authService.login(this.loginObj).subscribe({
    next: (res) => {
      this.isLoading = false;
      // The 'res.user' now contains 'firstName' and 'role' from our Java Map
      localStorage.setItem('loggedUser', JSON.stringify(res.user));
      alert(`Login Successful! Welcome ${res.user.firstName}`);
      this.router.navigateByUrl('/dashboard');
    },
    error: (err) => {
      this.isLoading = false;
      console.error('Full Error Object:', err);
        
      if (err.status === 401) {
        alert('Invalid email or password');
      } else if (err.status === 0) {
        alert('Backend unreachable! Check if Spring Boot is running and CORS is configured.');
      } else {
        alert('Login failed: ' + (err.error?.message || 'Unexpected Error'));
      }
    }
  });
}
}