import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; //

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Use the environment variable for the base path
  private apiUrl = `${environment.apiUrl}/users`; 

  constructor(private http: HttpClient) {}

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}