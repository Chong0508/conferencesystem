import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// 👇 Imports: Ensure these point to your actual service files
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

export interface ReviewerApplication {
  id: number;
  userId: number | string;
  userName: string;
  userEmail: string;
  reason?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private storageKey = 'mock_applications';

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  // ==========================================
  // 1. Author: Apply to be Reviewer
  // ==========================================
  applyForReviewer(user: any, reason: string): Observable<any> {
    const apps = this.getData(this.storageKey);

    // Check if already applied and pending
    const existing = apps.find((a: any) => a.userId === user.id && a.status === 'Pending');
    if (existing) {
      return of({ success: false, message: 'You already have a pending application.' });
    }

    const newApp: ReviewerApplication = {
      id: Date.now(),
      userId: user.id,
      userName: user.firstName + ' ' + user.lastName,
      userEmail: user.email,
      reason: reason,
      status: 'Pending',
      appliedAt: new Date()
    };

    apps.push(newApp);
    this.saveData(this.storageKey, apps);

    // Notify Admin (Uses the compatibility method we added in NotificationService)
    this.notificationService.addNotification({
      title: 'New Reviewer Application',
      message: `${newApp.userName} applied to become a Reviewer.`,
      type: 'info',
      recipientEmail: 'Admin'
    });

    return of({ success: true }).pipe(delay(500));
  }

  // ==========================================
  // 2. Admin: Get All Applications
  // ==========================================
  getApplications(): Observable<ReviewerApplication[]> {
    const apps = this.getData(this.storageKey);
    // Sort: Pending first, then by date desc
    return of(apps.sort((a: any, b: any) => {
      if (a.status === b.status) return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
      return a.status === 'Pending' ? -1 : 1;
    })).pipe(delay(300));
  }

  // ==========================================
  // 3. Admin: Process Application (Approve/Reject)
  // ==========================================
  processApplication(appId: number, status: 'Approved' | 'Rejected'): Observable<any> {
    const apps = this.getData(this.storageKey);
    const appIndex = apps.findIndex((a: any) => a.id === appId);

    if (appIndex !== -1) {
      const app = apps[appIndex];
      app.status = status;
      this.saveData(this.storageKey, apps);

      if (status === 'Approved') {
        // 🔥 Update User Role
        this.updateUserRole(app.userEmail, 'Reviewer');

        // Notify User
        this.notificationService.addNotification({
          title: 'Application Approved! 🎉',
          message: 'You are now a Reviewer! Please re-login to update your dashboard.',
          type: 'success',
          recipientEmail: app.userEmail
        });
      } else {
        // Notify User
        this.notificationService.addNotification({
          title: 'Application Update',
          message: 'Your reviewer application was not approved.',
          type: 'error',
          recipientEmail: app.userEmail
        });
      }

      return of({ success: true }).pipe(delay(500));
    }
    return of({ success: false });
  }

  // ==========================================
  // 4. Helper: Update User Role directly in mock DB
  // ==========================================
  private updateUserRole(email: string, newRole: string) {
    const usersString = localStorage.getItem('mock_users');
    if (usersString) {
      let users = JSON.parse(usersString);
      const userIndex = users.findIndex((u: any) => u.email === email);
      if (userIndex !== -1) {
        users[userIndex].role = newRole;
        localStorage.setItem('mock_users', JSON.stringify(users));
      }
    }
  }

  private getData(key: string): any[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveData(key: string, data: any[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
