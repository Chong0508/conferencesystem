import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  loggedUser: any = {
    firstName: 'Guest',
    lastName: '',
    role: 'Guest', 
    avatarColor: 'cccccc'
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    const userJson = localStorage.getItem('loggedUser');

    if (userJson) {
      this.loggedUser = JSON.parse(userJson);
      console.log('Current Dashboard User:', this.loggedUser.role);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onLogout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/login']);
  }
}
