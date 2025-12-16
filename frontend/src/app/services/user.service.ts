import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/users'; 

  constructor(private http: HttpClient) { }

  // 1. Get all users
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // 2. Get user by email
  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${email}`);
  }

  // 3. Register new user
  register(user: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, user);
  }

  // 4. Update existing user
  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${user.email}`, user);
  }

  // 5. Delete user
  deleteUser(email: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${email}`);
  }
}

