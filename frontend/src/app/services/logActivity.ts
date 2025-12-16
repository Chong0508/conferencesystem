import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LogActivityService {
  private baseUrl = 'http://localhost:8080/api/log-activities';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  clearAll(): Observable<any> {
    return this.http.delete<any>(this.baseUrl);
  }
}
