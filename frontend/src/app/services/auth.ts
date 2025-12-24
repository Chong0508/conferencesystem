import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

  // ==========================================================
  // 1. Register - LOGGING (Handled by Backend)
  // ==========================================================
  register(userData: any): Observable<any> {
    const backendUser = {
      firstName: userData.firstName, // Matches your Java User Model
      lastName: userData.lastName,
      email: userData.email,
      password_hash: userData.password,
      category: userData.role || 'Author',
      affiliation: userData.affiliation || 'N/A',
      country: 'Malaysia'
    };

    return this.http.post(this.baseUrl, backendUser);
  }

  // ==========================================================
  // 2. Login - LOGGING (Handled by Backend)
  // ==========================================================
  login(loginData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginData, { withCredentials: true }).pipe(
      catchError((err: any) => {
        return throwError(() => new Error(err.error?.message || 'Invalid credentials'));
      })
    );
  }

  getLoggedUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`, { withCredentials: true });
  }
}