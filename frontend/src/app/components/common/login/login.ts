import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth'; // Ensure path is correct

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
    if (this.loginObj.email && this.loginObj.password) {
      this.isLoading = true;

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

      // 🔓 NORMAL USER LOGIN (Author / Reviewer)
      // Call AuthService to verify registered credentials
      this.authService.login(this.loginObj).subscribe({

        next: (res) => {
          this.isLoading = false;

          // Save the registered user data (Role comes from registration)
          localStorage.setItem('loggedUser', JSON.stringify(res.user));

          alert(`Login Successful! Welcome ${res.user.firstName} (${res.user.role})`);
          this.router.navigateByUrl('/dashboard');
        },

        error: (err) => {
          this.isLoading = false;
          alert("Login Failed: " + (err.message || "Invalid credentials"));
        }
      });

    } else {
      alert("Please enter email and password");
    }
  }
}
