import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
// 👇 Import Notification Service
import { NotificationService } from '../../../services/notification';

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

  // Property to store the number of unread notifications
  unreadCount: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService // 👈 Inject Service
  ) {}

  ngOnInit() {
    this.loadUser();

    // 🔥 Setup Real-time Subscription
    if (this.loggedUser && this.loggedUser.email) {
      // 1. Force a refresh to get current state
      this.notificationService.refreshUnreadCount(this.loggedUser.email, this.loggedUser.role);

      // 2. Subscribe to changes (Whenever service updates, this updates)
      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      });
    }
  }

  loadUser() {
    const user = this.authService.getLoggedUser();
    if (user) {
      this.loggedUser = user;
    } else {
      this.router.navigate(['/login']);
    }
  }

  onLogout() {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
