import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, NotificationItem } from '../../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit {

  notifications: NotificationItem[] = [];
  isLoading = true;
  error = '';

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.error = '';
    const userJson = localStorage.getItem('loggedUser');
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user?.user_id ?? user?.id ?? null;

    const obs = userId
      ? this.notificationService.getNotificationsByUser(userId)
      : this.notificationService.getAllNotifications();

    obs.subscribe({
      next: (data) => {
        this.notifications = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load notifications', err);
        this.error = 'Failed to load notifications';
        this.isLoading = false;
      }
    });
  }

  markRead(n: NotificationItem) {
    if (!n.id || n.read) return;
    this.notificationService.markAsRead(n.id).subscribe({
      next: () => { n.read = true; },
      error: (err) => console.error('Failed to mark read', err)
    });
  }

  deleteNotification(n: NotificationItem) {
    if (!n.id) return;
    if (!confirm('Delete this notification?')) return;
    this.notificationService.deleteNotification(n.id).subscribe({
      next: () => { this.notifications = this.notifications.filter(x => x.id !== n.id); },
      error: (err) => { console.error('Failed to delete notification', err); alert('Could not delete notification'); }
    });
  }

  trackById(index: number, item: NotificationItem) {
    return item.id ?? index;
  }
}
