import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {
  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/api/conferences`;

  constructor(private http: HttpClient) { }

  getAllConferences(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      withCredentials: true
    });
  }

  getConferenceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  createConference(conferenceData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, conferenceData, {
      withCredentials: true
    });
  }

  updateConference(id: number, conferenceData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, conferenceData, {
      withCredentials: true
    });
  }

  deleteConference(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  getConferencesByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/status/${status}`, {
      withCredentials: true
    });
  }
}
