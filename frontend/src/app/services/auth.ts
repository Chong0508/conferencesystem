// File: frontend/src/app/services/auth.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userStorageKey = 'mock_db_users';
  private logStorageKey = 'mock_activity_logs';
  private loggedUserKey = 'loggedUser'; // Define as a constant

  constructor(private router: Router) { }

  // --- Helper: Get Current Logged-In User ---
  getLoggedUser(): any {
    const user = localStorage.getItem(this.loggedUserKey);
    return user ? JSON.parse(user) : null;
  }

  // --- Methods needed for route guards ---
  isLoggedIn(): boolean {
    return this.getLoggedUser() !== null;
  }

  getUserRole(): string {
    const user = this.getLoggedUser();
    return user ? user.role : 'guest';
  }

  // --- Logout method ---
  logout(): void {
    const user = this.getLoggedUser();
    if (user) {
      this.logActivity(
        user.firstName + ' ' + user.lastName,
        user.role,
        'Logout',
        'User logged out',
        'info'
      );
    }
    localStorage.removeItem(this.loggedUserKey);
    this.router.navigate(['/login']);
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
    // PASTIKAN ROLE DITETAPKAN SEMASA DAFTAR
    userData.role = userData.role || 'Author';

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
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@test.com',
        role: 'Admin',
        avatarColor: 'dc3545',
        id: 0
      };
      this.logActivity('System Admin', 'Admin', 'Login', 'Admin login successful', 'warning');
      // Save session
      localStorage.setItem(this.loggedUserKey, JSON.stringify(adminUser));
      return of({ token: 'admin-token', user: adminUser }).pipe(delay(500));
    }

    // Normal User Login
    const users = JSON.parse(localStorage.getItem(this.userStorageKey) || '[]');
    const foundUser = users.find((u: any) =>
      u.email === loginData.email && u.password === loginData.password
    );

    if (foundUser) {
      // --- PEMBAHARUAN PENTING: JAMINAN ROLE SENTIASA ADA ---
      // Jika pengguna lama tiada 'role', beri 'Author' sebagai default
      const userRole = foundUser.role || 'Author';

      const response = {
        token: 'fake-jwt-token-123456',
        user: {
          id: foundUser.id,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          email: foundUser.email,
          role: userRole, // <-- GUNAKAN ROLE YANG TELAH DIJAMIN
          avatarColor: userRole === 'Reviewer' ? 'ffc107' : '11998e'
        }
      };
      // Save session
      localStorage.setItem(this.loggedUserKey, JSON.stringify(response.user));

      this.logActivity(
        foundUser.firstName + ' ' + foundUser.lastName,
        userRole,
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
