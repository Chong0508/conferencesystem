import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  constructor() {
    // Initialize with some sample notifications (optional)
    this.addSampleNotifications();
  }

  // Request permission for browser notifications
  requestPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }

  // Get all notifications as Observable
  getNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  // Get unread count as Observable
  getUnreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  // Add a new notification
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification); // Add to beginning
    this.updateSubjects();

    // Show browser notification if permission granted
    this.showBrowserNotification(newNotification);
  }

  // Mark a notification as read
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.updateSubjects();
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.updateSubjects();
  }

  // Clear all notifications
  clearAll(): void {
    this.notifications = [];
    this.updateSubjects();
  }

  // Private helper methods
  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  private updateSubjects(): void {
    this.notificationsSubject.next([...this.notifications]);
    const unreadCount = this.notifications.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  private showBrowserNotification(notification: Notification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: this.getNotificationIcon(notification.type),
        tag: notification.id
      });
    }
  }

  private getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'assets/icons/success.png';
      case 'warning': return 'assets/icons/warning.png';
      case 'error': return 'assets/icons/error.png';
      default: return 'assets/icons/info.png';
    }
  }

  // Optional: Add some sample notifications for testing
  private addSampleNotifications(): void {
    const samples: Omit<Notification, 'id' | 'timestamp' | 'read'>[] = [
      {
        title: 'Welcome!',
        message: 'Welcome to the conference management system',
        type: 'info'
      },
      {
        title: 'New Conference Available',
        message: 'Tech Summit 2024 is now open for registration',
        type: 'success'
      },
      {
        title: 'Reminder',
        message: 'Your conference registration expires in 3 days',
        type: 'warning'
      }
    ];

    samples.forEach(sample => {
      const notification: Notification = {
        ...sample,
        id: this.generateId(),
        timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
        read: Math.random() > 0.5 // Random read status
      };
      this.notifications.push(notification);
    });

    this.updateSubjects();
  }
}
