import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Track {
  track_id?: number;
  conference_id?: number;
  name: string;
  chair_id?: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/api/tracks`;

  constructor(private http: HttpClient) { }

  getAllTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(this.apiUrl, { withCredentials: true });
  }

  getTrackById(id: number): Observable<Track> {
    return this.http.get<Track>(`${this.apiUrl}/${id}`);
  }

  createTrack(track: Track): Observable<Track> {
    // Adding { withCredentials: true } allows the browser to send session cookies
    return this.http.post<Track>(this.apiUrl, track, { withCredentials: true });
  }

  updateTrack(id: number, track: Track): Observable<Track> {
    return this.http.put<Track>(`${this.apiUrl}/${id}`, track);
  }

  deleteTrack(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
