import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationItem {
  id?: number;
  user_id?: number;
  title: string;
  body: string;
  read?: boolean;
  created_at?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) { }

  getAllNotifications(): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(this.apiUrl, { withCredentials: true });
  }

  getNotificationsByUser(userId: number): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(`${this.apiUrl}/user/${userId}`, { withCredentials: true });
  }

  getNotificationById(id: number): Observable<NotificationItem> {
    return this.http.get<NotificationItem>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  createNotification(payload: Partial<NotificationItem>): Observable<NotificationItem> {
    return this.http.post<NotificationItem>(this.apiUrl, payload, { withCredentials: true });
  }

  markAsRead(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/read`, {}, { withCredentials: true });
  }

  deleteNotification(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
