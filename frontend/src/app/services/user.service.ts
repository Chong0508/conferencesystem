import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      withCredentials: true
    });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/email/${email}`, {
      withCredentials: true
    });
  }

register(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, user, { 
        withCredentials: true
    });
}


  createAdmin(adminData: any) {
  const url = 'http://localhost:8080/users/admin';
  return this.http.post(url, adminData);
}

  login(loginData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, loginData, {
      withCredentials: true
    });
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, userData, {
      withCredentials: true
    });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }

  getUsersByRole(role: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/role/${role}`, {
      withCredentials: true
    });
  }

  updateUserPassword(id: number, passwordData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/password`, passwordData, {
      withCredentials: true
    });
  }
}
