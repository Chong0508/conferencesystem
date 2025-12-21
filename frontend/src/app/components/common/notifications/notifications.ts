import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService, AppNotification } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {

  notifications: AppNotification[] = [];
  currentUser: any = null;

  // Note: We don't strictly need unreadCount here for display logic anymore
  // since the service handles it, but kept for compatibility.
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
    this.currentUser = this.authService.getLoggedUser();
    if (this.currentUser) {
      // Get notifications list
      this.notificationService.getNotifications(this.currentUser.email, this.currentUser.role)
        .subscribe((data: AppNotification[]) => {
          this.notifications = data;
        });

      // Also subscribe to count to keep local UI in sync
      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      });
    }
  }

  markAsRead(notification: AppNotification): void {
    if (!notification.read) {
      notification.read = true; // Update UI immediately

      // 🔥 Call Service to update storage AND broadcast new count to Dashboard
      this.notificationService.markAsRead(
        notification.id,
        this.currentUser.email,
        this.currentUser.role
      );
    }

    // Navigate if link exists
    if (notification.link) {
      this.router.navigate([notification.link]);
    }
  }

  markAllAsRead(): void {
    if (this.currentUser) {
      // Update UI immediately
      this.notifications.forEach(n => n.read = true);

      // 🔥 Call Service to update storage AND broadcast new count to Dashboard
      this.notificationService.markAllAsRead(
        this.currentUser.email,
        this.currentUser.role
      );
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success': return 'bi-check-circle-fill text-success';
      case 'warning': return 'bi-exclamation-circle-fill text-warning';
      case 'error': return 'bi-x-circle-fill text-danger';
      default: return 'bi-info-circle-fill text-primary';
    }
  }

  getBgClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-success-subtle';
      case 'warning': return 'bg-warning-subtle';
      case 'error': return 'bg-danger-subtle';
      default: return 'bg-primary-subtle';
    }
  }
}