import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    const backendUser = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password_hash: userData.password,
      category: userData.role || 'Author',
      affiliation: userData.affiliation || 'N/A',
      country: 'Malaysia'
    };

    // ✅ FIX: Change from this.baseUrl to `${this.baseUrl}/users`
    return this.http.post(`${this.baseUrl}/users`, backendUser);
  }

  login(loginData: any): Observable<any> {
    // ✅ FIX: Change to `${this.baseUrl}/users/login`
    return this.http.post(`${this.baseUrl}/users/login`, loginData, { withCredentials: true }).pipe(
      catchError((err: any) => {
        return throwError(() => new Error(err.error?.message || 'Invalid credentials'));
      })
    );
  }

  getLoggedUser(): Observable<any> {
    // ✅ FIX: Change to `${this.baseUrl}/users/me`
    return this.http.get(`${this.baseUrl}/users/me`, { withCredentials: true });
  }
}