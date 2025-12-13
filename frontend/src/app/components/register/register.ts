import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
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
    affiliation: ''
  };

  isLoading: boolean = false; // To show a loading spinner (optional)

  // Inject AuthService
  constructor(private router: Router, private authService: AuthService) {}

  onRegister() {
    if (this.registerObj.password !== this.registerObj.confirmPassword) {
      alert("Error: Passwords do not match!");
      return;
    }

    if (this.registerObj.email && this.registerObj.password) {
      this.isLoading = true; // Start loading

      // 👇 THIS IS THE FINAL CODE. No changes needed later.
      this.authService.register(this.registerObj).subscribe({

        next: (res) => {
          // Success Callback
          this.isLoading = false;
          console.log('Server response:', res);
          alert("Registration Successful! Please login.");
          this.router.navigateByUrl('/login');
        },

        error: (err) => {
          // Error Callback
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
