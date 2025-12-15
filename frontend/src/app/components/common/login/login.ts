import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
// 👇 Import Service
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginObj: any = {
    email: '',
    password: ''
  };

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    if (this.loginObj.email && this.loginObj.password) {
      this.isLoading = true;
      this.errorMessage = '';

      // 👇 Use AuthService for login (It handles Admin backdoor internally now!)
      this.authService.login(this.loginObj).subscribe({

        next: (res: any) => {
          this.isLoading = false;

          // Token/User saving is handled in Service or here
          // For safety, ensure session is saved:
          if(res.user) {
            localStorage.setItem('loggedUser', JSON.stringify(res.user));
          }

          alert(`Login Successful! Welcome ${res.user.firstName} (${res.user.role})`);

          // Redirect based on role if needed, or just dashboard
          this.router.navigateByUrl('/dashboard/overview');
        },

        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.message || "Invalid credentials";
          alert("Login Failed: " + this.errorMessage);
        }
      });

    } else {
      alert("Please enter email and password");
    }
  }
}
