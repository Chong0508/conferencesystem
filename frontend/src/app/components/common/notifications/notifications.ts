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
      this.notificationService.getNotifications(this.currentUser.email, this.currentUser.role)
        .subscribe((data: AppNotification[]) => {
          this.notifications = data;
        });

      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      });
    }
  }

  markAsRead(notification: AppNotification): void {
    if (!notification.read) {
      notification.read = true; 
      this.notificationService.markAsRead(
        notification.id,
        this.currentUser.email,
        this.currentUser.role
      );
    }

    if (notification.link) {
      this.router.navigate([notification.link]);
    }
  }

  markAllAsRead(): void {
    if (this.currentUser) {
      this.notifications.forEach(n => n.read = true);
      this.notificationService.markAllAsRead(
        this.currentUser.email,
        this.currentUser.role
      );
    }
  }

  // UPDATED: Added Registration and Payment Types
  getIconClass(type: string): string {
    switch (type) {
      case 'payment': return 'bi-credit-card-fill text-success';
      case 'registration': return 'bi-person-check-fill text-primary';
      case 'success': return 'bi-check-circle-fill text-success';
      case 'warning': return 'bi-exclamation-circle-fill text-warning';
      case 'error': return 'bi-x-circle-fill text-danger';
      default: return 'bi-bell-fill text-secondary';
    }
  }

  // UPDATED: Added Registration and Payment Backgrounds
  getBgClass(type: string): string {
    switch (type) {
      case 'payment': return 'bg-success-subtle';
      case 'registration': return 'bg-primary-subtle';
      case 'success': return 'bg-success-subtle';
      case 'warning': return 'bg-warning-subtle';
      case 'error': return 'bg-danger-subtle';
      default: return 'bg-light';
    }
  }
}