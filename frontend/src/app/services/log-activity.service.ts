import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LogActivity {
  log_id?: number;
  user_id: number;
  action: string;
  details: string;
  login_time?: string;
  logout_time?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogActivityService {
  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/api/log-activities`;

  constructor(private http: HttpClient) { }

  getRecentLogs(limit = 5): Observable<LogActivity[]> {
      return this.http.get<LogActivity[]>(
        `${this.apiUrl}?limit=${limit}`,
        { withCredentials: true }
      );
    }

  getAllLogs(): Observable<LogActivity[]> {
    return this.http.get<LogActivity[]>(this.apiUrl, {
      withCredentials: true
    });
  }

  getLogById(id: number): Observable<LogActivity> {
    return this.http.get<LogActivity>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  createLog(log: LogActivity): Observable<LogActivity> {
    return this.http.post<LogActivity>(this.apiUrl, log, {
      withCredentials: true
    });
  }

  getLogsByUser(userId: number): Observable<LogActivity[]> {
    return this.http.get<LogActivity[]>(`${this.apiUrl}/user/${userId}`, {
      withCredentials: true
    });
  }

  getLogsByAction(action: string): Observable<LogActivity[]> {
    return this.http.get<LogActivity[]>(`${this.apiUrl}/action/${action}`, {
      withCredentials: true
    });
  }

  deleteLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  deleteAllLogs(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/all`, {
      withCredentials: true
    });
  }
}
