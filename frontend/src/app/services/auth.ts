import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';
  private userStorageKey = 'mock_db_users';
  private logStorageKey = 'mock_activity_logs';

  constructor(private http: HttpClient) { }

  // --- Helper: Get Current Logged-In User ---
  // This replaces localStorage.getItem('loggedUser') in components
  getLoggedUser(): any {
    const user = localStorage.getItem('loggedUser');
    return user ? JSON.parse(user) : null;
  }

  // ==========================================================
  // 1. Register (With Logging)
  // ==========================================================
  register(userData: any): Observable<any> {
    const users = JSON.parse(localStorage.getItem(this.userStorageKey) || '[]');

    const userExists = users.find((u: any) => u.email === userData.email);
    if (userExists) {
      return throwError(() => new Error('Email already exists!'));
    }

    userData.id = users.length + 1;
    userData.joinDate = new Date().toISOString().split('T')[0];

    users.push(userData);
    localStorage.setItem(this.userStorageKey, JSON.stringify(users));

    this.logActivity(
      userData.firstName + ' ' + userData.lastName,
      userData.role,
      'Register',
      'New account created',
      'success'
    );

    return of({ message: 'Registration successful', data: userData }).pipe(delay(800));
  }

  // ==========================================================
  // 2. Login (With Logging)
  // ==========================================================
  login(loginData: any): Observable<any> {
    // Backdoor for Admin
    if (loginData.email === 'admin@test.com' && loginData.password === '123') {
      const adminUser = {
        firstName: 'System', lastName: 'Admin', email: 'admin@test.com', role: 'Admin', avatarColor: 'dc3545'
      };
      this.logActivity('System Admin', 'Admin', 'Login', 'Admin login successful', 'warning');
      // Save session
      localStorage.setItem('loggedUser', JSON.stringify(adminUser));
      return of({ token: 'admin-token', user: adminUser }).pipe(delay(500));
    }

    // Normal User Login
    const users = JSON.parse(localStorage.getItem(this.userStorageKey) || '[]');
    const foundUser = users.find((u: any) =>
      u.email === loginData.email && u.password === loginData.password
    );

    if (foundUser) {
      const response = {
        token: 'fake-jwt-token-123456',
        user: {
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          email: foundUser.email,
          role: foundUser.role || 'Author',
          avatarColor: foundUser.role === 'Reviewer' ? 'ffc107' : '11998e'
        }
      };
      // Save session
      localStorage.setItem('loggedUser', JSON.stringify(response.user));

      this.logActivity(
        foundUser.firstName + ' ' + foundUser.lastName,
        foundUser.role || 'Author',
        'Login',
        'Login successful',
        'success'
      );

      return of(response).pipe(delay(800));
    } else {
      return throwError(() => new Error('Invalid email or password'));
    }
  }

  // ==========================================================
  // 3. Activity Logs
  // ==========================================================
  getActivityLogs(): Observable<any[]> {
    const logs = JSON.parse(localStorage.getItem(this.logStorageKey) || '[]');
    return of(logs).pipe(delay(300));
  }

  clearActivityLogs(): Observable<any> {
    localStorage.removeItem(this.logStorageKey);
    return of({ success: true }).pipe(delay(300));
  }

  private logActivity(user: string, role: string, action: string, details: string, type: string) {
    const logs = JSON.parse(localStorage.getItem(this.logStorageKey) || '[]');
    const newLog = {
      id: Date.now(),
      user: user,
      role: role,
      action: action,
      details: details,
      type: type,
      timestamp: new Date().toLocaleString()
    };
    logs.unshift(newLog);
    localStorage.setItem(this.logStorageKey, JSON.stringify(logs));
  }
}
