import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth'; // Ensure path is correct based on your file structure

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  // Added 'role' with a default value
  registerObj: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    affiliation: '',
    role: 'Author' // Default role
  };

  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  onRegister() {
    // 1. Validate Passwords
    if (this.registerObj.password !== this.registerObj.confirmPassword) {
      alert("Error: Passwords do not match!");
      return;
    }

    // 2. Check Required Fields
    if (this.registerObj.email && this.registerObj.password && this.registerObj.firstName && this.registerObj.role) {
      this.isLoading = true;

      // 3. Call Service to Register
      this.authService.register(this.registerObj).subscribe({
              next: (res) => {
                this.isLoading = false;
                console.log('Server response:', res);
                alert("Registration Successful! Please login with your new account.");
                this.router.navigateByUrl('/login');
              },
              // 👇 UPDATED ERROR HANDLING
              error: (err) => {
                this.isLoading = false;
                console.error('❌ Registration Error:', err);

                // Customize the alert based on the error type
                if (err.status === 0) {
                  alert("Connection Refused: Is your Java Backend running on port 8080?");
                } else if (err.status === 400) {
                  alert("Bad Request: The backend rejected the data. Check the console for missing fields.");
                } else if (err.status === 500) {
                  alert("Server Error: Check your Java console for SQL or Null Pointer exceptions.");
                } else {
                  alert("Registration failed. See console for details.");
                }
              }
            });

    } else {
      alert("Please fill in all required fields.");
    }
  }
}
