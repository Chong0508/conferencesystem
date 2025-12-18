import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaperService {

  private baseUrl = 'http://localhost:8080/api/papers';
  private tracksUrl = 'http://localhost:8080/api/tracks';

  constructor(private http: HttpClient) {}

  getAllPapers(): Observable<any[]> {
      return this.http.get<any[]>(this.baseUrl, { withCredentials: true });
    }

    submitPaper(payload: any): Observable<any> {
      return this.http.post('http://localhost:8080/api/papers', payload, {
        withCredentials: true
      });
    }

    getPapersByAuthor(authorId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/author/${authorId}`, { withCredentials: true });
    }
}
