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

  // 🔴 FIX: 默认不要写死成 Admin，防止权限泄露
  loggedUser: any = {
    firstName: 'Guest',
    lastName: '',
    role: 'Guest', // 默认是访客，没有任何权限
    avatarColor: 'cccccc'
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    // 1. 从 LocalStorage 获取当前登录用户
    const userJson = localStorage.getItem('loggedUser');

    if (userJson) {
      this.loggedUser = JSON.parse(userJson);
      // 调试用：在 Console 打印当前身份，方便你检查
      console.log('Current Dashboard User:', this.loggedUser.role);
    } else {
      // 2. 如果没登录，踢回登录页
      this.router.navigate(['/login']);
    }
  }

  onLogout() {
    // 清除登录信息
    localStorage.removeItem('loggedUser');
    // 跳转回 Landing Page 或 Login
    this.router.navigate(['/login']);
  }
}
