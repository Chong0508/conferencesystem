import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private router: Router) {}

  onLogin() {

    if (this.loginObj.email && this.loginObj.password) {

      alert("Login Success！Welcome to G5ConfEase");
      this.router.navigateByUrl('/dashboard');
    } else {

      alert("Please enter your Email and Password");
    }
  }
}
