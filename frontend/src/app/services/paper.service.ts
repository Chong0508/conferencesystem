import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaperService {
  private apiUrl = 'http://localhost:8080/api/papers';

  constructor(private http: HttpClient) { }

  // Create/Submit Paper (FormData handles Multipart)
  submitPaper(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData, { withCredentials: true });
  }

  // Update Paper
  updatePaper(id: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData, { withCredentials: true });
  }

  // Admin/Payment: Update only the status of a paper
  updatePaperStatus(id: number, status: string): Observable<any> {
    // This calls the specific status update endpoint
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, { status }, { withCredentials: true });
  }

  getPaperById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getAllPapers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { withCredentials: true });
  }

  getPapersByAuthor(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/author/${userId}`, { withCredentials: true });
  }

  // Corrected Download Path based on your Controller: /api/papers/download/{fileName}
  downloadPaper(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${fileName}`, {
      responseType: 'blob',
      withCredentials: true
    });
  }

  deletePaper(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}