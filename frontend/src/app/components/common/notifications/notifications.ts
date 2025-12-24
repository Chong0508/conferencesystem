import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService, AppNotification } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {
  notifications: AppNotification[] = [];
  unreadCount: number = 0;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const user: any = this.authService.getLoggedUser();

    if (user) {
      const userId = user.id || user.user_id || user.userId;
      const role = user.role || user.category || 'Author';

      console.log('Current User ID:', userId); // Debug Log

      if (userId) {
        this.notificationService.getNotifications(userId, role).subscribe({
          next: (data) => {
            this.notifications = data;
          },
          error: (err) => console.error('Failed to load notifications:', err)
        });
      }
    } else {
      console.warn('No user logged in found.');
    }

    this.notificationService.unreadCount$.subscribe(count => this.unreadCount = count);
  }

  markAsRead(notification: AppNotification): void {
    if (!notification.read) {
      notification.read = true;
      this.notificationService.markAsRead(notification).subscribe();
    }
    if (notification.link) {
      this.router.navigate([notification.link]);
    }
  }

  markAllAsRead(): void {
    if (this.notifications.length > 0) {
      this.notifications.forEach(n => n.read = true);

      this.notificationService.markAllAsRead(this.notifications);
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success': return 'bi-check-circle-fill text-success';
      case 'warning': return 'bi-exclamation-circle-fill text-warning';
      case 'error': return 'bi-x-circle-fill text-danger';
      default: return 'bi-bell-fill text-primary';
    }
  }

  getBgClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-success-subtle';
      case 'warning': return 'bg-warning-subtle';
      case 'error': return 'bg-danger-subtle';
      default: return 'bg-light';
    }
  }
}
