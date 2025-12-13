import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  // ==========================================================
  // 1. REGISTER FUNCTION
  // ==========================================================
  register(userData: any): Observable<any> {

    // MOCK SIMULATION
    // Get existing users or empty array
    const users = JSON.parse(localStorage.getItem('mock_db_users') || '[]');

    // Add the new user (including their selected Role!)
    users.push(userData);

    // Save back to Local Storage
    localStorage.setItem('mock_db_users', JSON.stringify(users));

    return of({
      message: 'Registration successful',
      data: userData
    }).pipe(delay(800));
  }


  // ==========================================================
  // 2. LOGIN FUNCTION
  // ==========================================================
  login(loginData: any): Observable<any> {

    // MOCK SIMULATION
    const users = JSON.parse(localStorage.getItem('mock_db_users') || '[]');

    // Find the user
    const foundUser = users.find((u: any) =>
      u.email === loginData.email && u.password === loginData.password
    );

    if (foundUser) {
      // SUCCESS
      const response = {
        token: 'fake-jwt-token-123456',
        user: {
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          email: foundUser.email,

          // 👇👇👇 关键修改在这里！FIX IS HERE! 👇👇👇
          // 以前这里写死是 'Author'，现在我们读取数据库里存的 role
          role: foundUser.role || 'Author',

          // 如果是 Author 给绿色，如果是 Reviewer 给黄色
          avatarColor: foundUser.role === 'Reviewer' ? 'ffc107' : '11998e'
        }
      };
      return of(response).pipe(delay(800));
    } else {
      // ERROR
      return throwError(() => new Error('Invalid email or password'));
    }
  }
}
