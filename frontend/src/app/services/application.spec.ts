import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; // Check this path!

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  // Use the variable from environment.ts instead of a hardcoded string
  private apiUrl = `${environment.apiUrl}/api/applications`; 

  constructor(private http: HttpClient) { }

  getApplications() {
    return this.http.get(this.apiUrl);
  }
}

