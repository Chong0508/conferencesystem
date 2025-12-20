import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaperService {
  private apiUrl = 'http://localhost:8080/api/papers';

  constructor(private http: HttpClient) { }

  submitPaper(paperData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, paperData, { withCredentials: true });
  }

  getPaperById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getAllPapers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { withCredentials: true });
  }

  getPapersByAuthor(authorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/author/${authorId}`, { withCredentials: true });
  }
}
