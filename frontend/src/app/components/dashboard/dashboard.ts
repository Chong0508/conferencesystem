import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  loggedUser: any = {
    firstName: 'Guest',
    lastName: 'User',
    role: 'Visitor',
    avatarColor: 'cccccc'
  };

  constructor(private router: Router) {}

  ngOnInit() {
    // 1. 读取用户信息
    const localData = localStorage.getItem('loggedUser');
    if (localData != null) {
      this.loggedUser = JSON.parse(localData);
    }
  }

  onLogout() {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem('loggedUser');
      this.router.navigateByUrl('/login');
    }
  }
}
