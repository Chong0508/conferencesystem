import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LogActivityService } from './log-activity.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient, private logActivityService: LogActivityService) { }

  // ==========================================================
  // 1. Register
  // ==========================================================
  register(userData: any): Observable<any> {
    const backendUser = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password_hash: userData.password,
      affiliation: userData.affiliation || 'N/A',
      country: 'Malaysia',
      role: userData.role || 'Author',
      orcid: userData.orcid || '',
      is_email_verified: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('📤 Sending to Backend:', backendUser);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Note: 'return' is required here to satisfy TS2355
    return this.http.post(this.baseUrl, backendUser, { headers }).pipe(
      tap((savedUser: any) => {
        console.log('✅ Success! Saved to DB:', savedUser);
        this.logActivity(savedUser.user_id, 'Register', `New user registered: ${savedUser.email}`);
      })
    );
  }

  // ==========================================================
  // 2. Login
  // ==========================================================
  login(loginData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginData, { withCredentials: true }).pipe(
      tap((response: any) => {
        if (response && response.user) {
          console.log('✅ Login Successful. Session managed by Backend.');
          this.logActivity(response.user.user_id, 'Login', 'User logged in');
        }
      }),
      catchError((err: any) => {
        console.error('Login Failed:', err);
        return throwError(() => new Error(err.error || 'Invalid credentials'));
      })
    );
  }

  getLoggedUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`, { withCredentials: true });
  }

  // Helper to log activity
  private logActivity(userId: number, action: string, details: string) {
    this.logActivityService.createLog({
      user_id: userId,
      action: action,
      details: details,
      login_time: new Date().toISOString()
    }).subscribe({
      next: () => console.log('📝 Activity Logged'),
      error: e => console.error('❌ Log failed', e)
    });
  }
}
