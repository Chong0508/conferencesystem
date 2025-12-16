import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/users'; // matches your backend

  constructor(private http: HttpClient) {}

  // --- User CRUD ---
  register(userData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, userData);
  }

  login(credentials: any): Observable<any> {
    // implement login endpoint if exists
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, userData);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // --- Local session helpers ---
  setLoggedUser(user: any) {
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }

  getLoggedUser() {
    const user = localStorage.getItem('loggedUser');
    return user ? JSON.parse(user) : null;
  }
}
