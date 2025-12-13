import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs'; // RxJS is used for handling async data
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // API URL (Prepare for future)
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  // ==========================================================
  // 1. REGISTER FUNCTION
  // ==========================================================
  register(userData: any): Observable<any> {

    // ----------------- OPTION A: REAL BACKEND (Use this later) -----------------
    // return this.http.post(`${this.baseUrl}/register`, userData);

    // ----------------- OPTION B: MOCK SIMULATION (Use this now) -----------------
    // We use 'of()' to create a fake Observable response
    // We use 'delay(1000)' to simulate network loading time (1 second)

    // Simulate saving to DB
    const users = JSON.parse(localStorage.getItem('mock_db_users') || '[]');
    users.push(userData);
    localStorage.setItem('mock_db_users', JSON.stringify(users));

    // Return a fake success response
    return of({
      message: 'Registration successful',
      data: userData
    }).pipe(delay(800));
  }


  // ==========================================================
  // 2. LOGIN FUNCTION
  // ==========================================================
  login(loginData: any): Observable<any> {

    // ----------------- OPTION A: REAL BACKEND (Use this later) -----------------
    // return this.http.post(`${this.baseUrl}/login`, loginData);

    // ----------------- OPTION B: MOCK SIMULATION (Use this now) -----------------
    const users = JSON.parse(localStorage.getItem('mock_db_users') || '[]');

    // Find user
    const foundUser = users.find((u: any) =>
      u.email === loginData.email && u.password === loginData.password
    );

    if (foundUser) {
      // SUCCESS: Return user data
      const response = {
        token: 'fake-jwt-token-123456', // Simulate a token
        user: {
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          email: foundUser.email,
          role: 'Author',
          avatarColor: '11998e'
        }
      };
      return of(response).pipe(delay(800)); // Simulate 0.8s delay
    } else {
      // ERROR: Return 401 Unauthorized simulation
      return throwError(() => new Error('Invalid email or password'));
    }
  }
}
