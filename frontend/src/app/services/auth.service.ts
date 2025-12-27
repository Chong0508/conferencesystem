import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // --- API Methods ---

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, {
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        console.log('✅ Registration successful:', response);
      })
    );
  }

  login(loginData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Note: withCredentials: true is vital for session management later
    return this.http.post(`${this.apiUrl}/login`, loginData, { headers, withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        // Clear local storage on logout
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('authToken');
        console.log('✅ Logout successful');
      })
    );
  }

  // --- Helper Methods ---

  // Standard method to get user from local storage
  getCurrentUser(): any {
    const user = localStorage.getItem('loggedUser');
    return user ? JSON.parse(user) : null;
  }

  // 🔥 Fix: Added this alias method because your components call 'getLoggedUser()'
  getLoggedUser(): any {
    return this.getCurrentUser();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('loggedUser');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // 🔥 Helper: Updates the user session in local storage (e.g., when role changes)
  updateUserSession(updatedUser: any) {
    localStorage.setItem('loggedUser', JSON.stringify(updatedUser));
  }
}
