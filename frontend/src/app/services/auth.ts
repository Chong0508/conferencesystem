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
  private logStorageKey = 'mock_activity_logs'; // 👈 新增：日志的存储 Key

  constructor(private http: HttpClient) { }

  // ==========================================================
  // 1. 注册功能 (已连接日志)
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

    // 👇👇👇【新增】记录真实日志 👇👇👇
    this.logActivity(
      userData.firstName + ' ' + userData.lastName, // User Name
      userData.role,                                // Role
      'Register',                                   // Action
      'New account created',                        // Details
      'success'                                     // Type
    );

    return of({
      message: 'Registration successful',
      data: userData
    }).pipe(delay(800));
  }


  // ==========================================================
  // 2. 登录功能 (已连接日志)
  // ==========================================================
  login(loginData: any): Observable<any> {

    // 特殊后门：Admin 登录
    if (loginData.email === 'admin@test.com' && loginData.password === '123') {
      const adminUser = {
        firstName: 'System', lastName: 'Admin', email: 'admin@test.com', role: 'Admin', avatarColor: 'dc3545'
      };

      // 👇👇👇【新增】记录 Admin 登录日志
      this.logActivity('System Admin', 'Admin', 'Login', 'Admin login successful', 'warning');

      return of({ token: 'admin-token', user: adminUser }).pipe(delay(500));
    }

    // 普通用户登录
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

      // 👇👇👇【新增】记录普通用户登录日志
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
  // 3. 【新功能】通用日志记录函数
  // ==========================================================
  private logActivity(user: string, role: string, action: string, details: string, type: string) {
    // 1. 读取现有日志
    const logs = JSON.parse(localStorage.getItem(this.logStorageKey) || '[]');

    // 2. 创建新日志对象
    const newLog = {
      id: Date.now(), // 使用时间戳作为唯一 ID
      user: user,
      role: role,
      action: action,
      details: details,
      type: type,
      timestamp: new Date().toLocaleString() // 当前时间
    };

    // 3. 加到最前面 (最新的在上面)
    logs.unshift(newLog);

    // 4. 存回 Local Storage
    localStorage.setItem(this.logStorageKey, JSON.stringify(logs));
  }
}
