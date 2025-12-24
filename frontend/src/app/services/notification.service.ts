import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';
import { AuthService } from './auth.service';

export interface BackendNotification {
  notification_id?: number;
  user_id: number;
  message: string;
  type: string;
  is_read: boolean;
  sent_at?: string;
}

export interface AppNotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  timestamp: Date;
  read: boolean;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = 'http://localhost:8080/api/notifications';
  public unreadCount$ = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // ==============================================================
  // 1. COMPATIBILITY FIX: Restore 'addNotification'
  // ==============================================================
  addNotification(config: { title?: string, message: string, type: string, recipientEmail?: string }) {
    this.authService.getLoggedUser().subscribe({
      next: (user: any) => {
        const userId = user.id || user.user_id;

        if (userId) {
          this.createNotification(userId, config.message, config.type);
        } else {
          console.error('Cannot send notification: User ID not found.');
        }
      },
      // FIXED: Added ': any' to the error parameter
      error: (err: any) => console.error('Failed to resolve user for notification', err)
    });
  }

  // ==============================================================
  // 2. Create Notification (Backend Call)
  // ==============================================================
  // ==============================================================
    // 2. Create Notification (Backend Call)
    // ==============================================================
    createNotification(userId: number, message: string, type: string) {
      const payload: BackendNotification = {
        user_id: userId,
        message: message,
        type: type,
        is_read: false,
        // FIX: Send the timestamp so the database doesn't complain
        sent_at: new Date().toISOString()
      };

      console.log("📨 Sending Notification Payload:", payload); // Debug Log

      this.http.post(this.baseUrl, payload).subscribe({
        next: (res) => console.log('✅ Notification saved to DB', res),
        error: (err: any) => console.error('❌ Failed to save notification', err)
      });
    }

  /// ==============================================================
     // 3. Get Notifications (FIXED FILTER LOGIC)
     // ==============================================================
     getNotifications(currentUserId: number | string, currentUserRole: string): Observable<AppNotification[]> {
       return this.http.get<BackendNotification[]>(this.baseUrl).pipe(
         tap(allData => console.log('1. Raw Backend Data:', allData)), // DEBUG LOG

         map(allNotifications => {
           // FILTER: Convert both to numbers to ensure "5" matches 5
           const myNotifications = allNotifications.filter(n => {
             const backendId = Number(n.user_id);
             const myId = Number(currentUserId);

             return backendId === myId;
           });

           console.log(`2. Filtered for User ID ${currentUserId}:`, myNotifications); // DEBUG LOG

           // MAP: Convert Backend format to Frontend UI format
           const uiNotifications = myNotifications.map(n => this.mapToFrontend(n));

           // SORT: Newest first
           return uiNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
         }),

         tap(finalList => {
           // COUNT: Update the unread count badge
           const count = finalList.filter(n => !n.read).length;
           this.unreadCount$.next(count);
         })
       );
     }

  // ==============================================================
  // 4. Mark as Read
  // ==============================================================
  markAsRead(notification: AppNotification): Observable<any> {
    const backendPayload: BackendNotification = {
      user_id: notification.userId,
      message: notification.message,
      type: notification.type,
      is_read: true
    };

    return this.http.put(`${this.baseUrl}/${notification.id}`, backendPayload).pipe(
      tap(() => {
        const currentCount = this.unreadCount$.value;
        if (currentCount > 0) this.unreadCount$.next(currentCount - 1);
      })
    );
  }

  markAllAsRead(notifications: AppNotification[]): void {
    notifications.forEach(n => {
      if (!n.read) {
        this.markAsRead(n).subscribe();
      }
    });
  }

  // ==============================================================
  // Helpers
  // ==============================================================
  private mapToFrontend(bn: BackendNotification): AppNotification {
    return {
      id: bn.notification_id!,
      userId: bn.user_id,
      title: this.generateTitle(bn.type),
      message: bn.message,
      type: bn.type,
      timestamp: bn.sent_at ? new Date(bn.sent_at) : new Date(),
      read: bn.is_read || false,
      link: this.generateLink(bn.type)
    };
  }

  private generateTitle(type: string): string {
    if (type === 'success') return 'Success';
    if (type === 'warning') return 'Action Required';
    if (type === 'error') return 'Alert';
    return 'Notification';
  }

  private generateLink(type: string): string {
    if (type === 'payment') return '/payment-history';
    if (type === 'registration') return '/my-conferences';
    return '';
  }
}
