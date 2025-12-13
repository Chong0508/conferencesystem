import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

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

  // Inject AuthService
  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    if (this.loginObj.email && this.loginObj.password) {
      this.isLoading = true;

      // 👇 THIS IS THE FINAL CODE.
      this.authService.login(this.loginObj).subscribe({

        next: (res) => {
          this.isLoading = false;

          // Save the "real" user data from the response
          localStorage.setItem('loggedUser', JSON.stringify(res.user));

          alert("Login Successful! Welcome " + res.user.firstName);
          this.router.navigateByUrl('/dashboard');
        },

        error: (err) => {
          this.isLoading = false;
          // 'err' here simulates an HTTP error object
          alert("Login Failed: " + (err.message || "Server Error"));
        }
      });

    } else {
      alert("Please enter email and password");
    }
  }
}
