import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaperService {
  private apiUrl = 'http://localhost:8080/api/papers';

  constructor(private http: HttpClient) { }

  // Accept FormData that contains metadata + file
  submitPaper(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData, {
      withCredentials: true
      // DO NOT set Content-Type; browser will set multipart/form-data boundary
    });
  }

  // existing methods...
}
