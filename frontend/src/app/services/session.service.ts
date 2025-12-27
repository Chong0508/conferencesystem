import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
   private apiUrl = environment.apiUrl;
  private baseUrl = `${this.apiUrl}/api/sessions`;

  constructor(private http: HttpClient) { }

  // GET: Fetch all sessions
  getAllSessions(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // POST: Create a new session
  createSession(sessionData: any): Observable<any> {
    return this.http.post(this.baseUrl, sessionData);
  }

  // DELETE: Remove a session
  deleteSession(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
