import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, {
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        console.log('✅ Registration successful:', response);
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        localStorage.setItem('loggedUser', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.token || '');
        console.log('✅ Login successful:', response);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('authToken');
        console.log('✅ Logout successful');
      })
    );
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('loggedUser');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('loggedUser');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
