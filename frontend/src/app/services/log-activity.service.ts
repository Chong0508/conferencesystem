import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:8080/api/log-activities';

  constructor(private http: HttpClient) { }

  getAllLogs(): Observable<LogActivity[]> {
    return this.http.get<LogActivity[]>(this.apiUrl);
  }

  createLog(log: LogActivity): Observable<LogActivity> {
    return this.http.post<LogActivity>(this.apiUrl, log);
  }

  deleteLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
