import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface AppNotification {
  id: number;
  recipientEmail: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private storageKey = 'mock_notifications';
  private ADMIN_TARGET = 'Admin'; // Target string for all admins

  // Real-time stream
  public unreadCount$ = new BehaviorSubject<number>(0);

  constructor() {}

  // ==============================================================
  // 1. Refresh Unread Count
  // ==============================================================
  refreshUnreadCount(currentUserEmail: string, currentUserRole: string) {
    const notifications = this.loadFromStorage();
    const count = notifications.filter(n => {
      // If Admin, they see messages for 'Admin' target OR their email
      const isMine = (currentUserRole === 'Admin')
        ? (n.recipientEmail === this.ADMIN_TARGET || n.recipientEmail === currentUserEmail)
        : (n.recipientEmail === currentUserEmail);
      return isMine && !n.read;
    }).length;

    this.unreadCount$.next(count);
  }

  // ==============================================================
  // 2. Get Notifications
  // ==============================================================
  getNotifications(currentUserEmail: string, currentUserRole: string): Observable<AppNotification[]> {
    let allNotifications = this.loadFromStorage();

    // Refresh count whenever we check the list
    this.refreshUnreadCount(currentUserEmail, currentUserRole);

    const myNotifications = allNotifications.filter(n => {
      if (currentUserRole === 'Admin') {
        return n.recipientEmail === this.ADMIN_TARGET || n.recipientEmail === currentUserEmail;
      }
      return n.recipientEmail === currentUserEmail;
    });

    return of(myNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }

  // ==============================================================
  // 3. Generic Add (For Conference compatibility)
  // ==============================================================
  addNotification(config: { title: string, message: string, type: 'success' | 'info' | 'warning' | 'error', recipientEmail?: string }) {
    this.send(
      config.recipientEmail || this.ADMIN_TARGET,
      config.title,
      config.message,
      config.type
    );
  }

  // ==============================================================
  // 4. Core Send Logic
  // ==============================================================
  private send(recipient: string, title: string, message: string, type: 'success' | 'info' | 'warning' | 'error', link: string = '') {
    const notifications = this.loadFromStorage();

    const newNote: AppNotification = {
      id: Date.now(),
      recipientEmail: recipient,
      title: title,
      message: message,
      type: type,
      timestamp: new Date(),
      read: false,
      link: link
    };

    notifications.push(newNote);
    this.saveToStorage(notifications);

    console.log(`✅ Notification stored for: ${recipient}`);
  }

  // ==============================================================
  // 5. Triggers
  // ==============================================================

  // 🔥 This is the one Admin needs to see
  notifyAdminNewSubmission(authorName: string, paperTitle: string) {
    this.send(
      this.ADMIN_TARGET, // Sends to 'Admin'
      'New Paper Submitted',
      `${authorName} has submitted a new paper: "${paperTitle}".`,
      'info',
      '/dashboard/all-papers'
    );
  }

  notifyReviewerAssignment(reviewerEmail: string, paperTitle: string) {
    this.send(reviewerEmail, 'New Assignment', `You have been assigned to review: "${paperTitle}".`, 'warning', '/dashboard/reviews');
  }

  notifyAdminReviewCompleted(reviewerName: string, paperTitle: string) {
    this.send(this.ADMIN_TARGET, 'Review Completed', `${reviewerName} reviewed "${paperTitle}".`, 'success', '/dashboard/all-papers');
  }

  notifyAuthorApproval(authorEmail: string, paperTitle: string) {
    this.send(authorEmail, '🎉 Paper Accepted!', `Your paper "${paperTitle}" has been ACCEPTED.`, 'success', '/dashboard/my-submissions');
  }

  notifyAuthorRejection(authorEmail: string, paperTitle: string) {
    this.send(authorEmail, 'Paper Status Update', `Your paper "${paperTitle}" was rejected.`, 'error', '/dashboard/my-submissions');
  }

  notifyRegistrationSuccess(userEmail: string, conferenceTitle: string) {
    this.send(userEmail, 'Registration Confirmed', `You registered for "${conferenceTitle}".`, 'success', '/dashboard/conference-list');
  }

  // ==============================================================
  // 6. Helpers
  // ==============================================================
  markAsRead(id: number, currentUserEmail: string, currentUserRole: string) {
    const notifications = this.loadFromStorage();
    const target = notifications.find(n => n.id === id);
    if (target) {
      target.read = true;
      this.saveToStorage(notifications);
      this.refreshUnreadCount(currentUserEmail, currentUserRole);
    }
  }

  markAllAsRead(currentUserEmail: string, currentUserRole: string) {
    const notifications = this.loadFromStorage();
    notifications.forEach(n => {
      const isMine = (currentUserRole === 'Admin')
        ? (n.recipientEmail === this.ADMIN_TARGET || n.recipientEmail === currentUserEmail)
        : (n.recipientEmail === currentUserEmail);
      if (isMine) n.read = true;
    });
    this.saveToStorage(notifications);
    this.refreshUnreadCount(currentUserEmail, currentUserRole);
  }

  getUnreadCount(currentUserEmail: string, role: string): Observable<number> {
    this.refreshUnreadCount(currentUserEmail, role);
    return this.unreadCount$;
  }

  private loadFromStorage(): AppNotification[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(data: AppNotification[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}