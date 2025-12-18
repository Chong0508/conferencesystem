import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {

  private apiUrl = 'http://localhost:8080/api/conferences';

  constructor(private http: HttpClient) { }

  createConference(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getAllConferences(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
