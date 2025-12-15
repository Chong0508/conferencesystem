import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {

  private trackStorageKey = 'mock_tracks';
  private confStorageKey = 'mock_conferences';
  private sessionStorageKey = 'mock_sessions';
  private regStorageKey = 'mock_registrations'; // 👈 New Key for Registrations

  constructor() { }

  // ==========================================
  // 1. Track Management
  // ==========================================
  getAllTracks(): Observable<any[]> {
    const data = localStorage.getItem(this.trackStorageKey);
    let tracks = data ? JSON.parse(data) : [
      { id: 1, name: 'Artificial Intelligence (AI)' },
      { id: 2, name: 'Software Engineering' },
      { id: 3, name: 'Cybersecurity' }
    ];
    if (!data) localStorage.setItem(this.trackStorageKey, JSON.stringify(tracks));
    return of(tracks).pipe(delay(300));
  }

  addTrack(trackName: string): Observable<any> {
    const tracks = this.getDataSync(this.trackStorageKey);
    const newTrack = { id: tracks.length + 1, name: trackName };
    tracks.push(newTrack);
    this.saveData(this.trackStorageKey, tracks);
    return of(newTrack).pipe(delay(300));
  }

  updateTrack(updatedTrack: any): Observable<any> {
    const tracks = this.getDataSync(this.trackStorageKey);
    const index = tracks.findIndex((t: any) => t.id === updatedTrack.id);
    if (index !== -1) {
      tracks[index] = updatedTrack;
      this.saveData(this.trackStorageKey, tracks);
    }
    return of(updatedTrack);
  }

  deleteTrack(id: number): Observable<any> {
    let tracks = this.getDataSync(this.trackStorageKey);
    tracks = tracks.filter((t: any) => t.id !== id);
    this.saveData(this.trackStorageKey, tracks);
    return of({ success: true });
  }

  // ==========================================
  // 2. Conference Management
  // ==========================================
  getAllConferences(): Observable<any[]> {
    const data = this.getDataSync(this.confStorageKey);
    return of(data).pipe(delay(300));
  }

  createConference(confData: any): Observable<any> {
    const conferences = this.getDataSync(this.confStorageKey);
    confData.id = Date.now();
    conferences.push(confData);
    this.saveData(this.confStorageKey, conferences);
    return of({ success: true }).pipe(delay(300));
  }

  // ==========================================
  // 3. Session Management
  // ==========================================
  getAllSessions(): Observable<any[]> {
    const data = localStorage.getItem(this.sessionStorageKey);
    let sessions = data ? JSON.parse(data) : [];
    return of(sessions).pipe(delay(300));
  }

  addSession(sessionData: any): Observable<any> {
    const sessions = this.getDataSync(this.sessionStorageKey);
    sessionData.id = Date.now();
    sessions.push(sessionData);
    this.saveData(this.sessionStorageKey, sessions);
    return of({ success: true }).pipe(delay(300));
  }

  deleteSession(id: number): Observable<any> {
    let sessions = this.getDataSync(this.sessionStorageKey);
    sessions = sessions.filter((s: any) => s.id !== id);
    this.saveData(this.sessionStorageKey, sessions);
    return of({ success: true });
  }

  // ==========================================
  // 4. Registration Management (New)
  // ==========================================
  createRegistration(regData: any): Observable<any> {
    const registrations = this.getDataSync(this.regStorageKey);
    regData.id = Date.now();
    regData.date = new Date();
    regData.status = 'Confirmed';

    registrations.push(regData);
    this.saveData(this.regStorageKey, registrations);

    return of({ success: true }).pipe(delay(500));
  }

  // ==========================================
  // Internal Helpers
  // ==========================================
  private getDataSync(key: string): any[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveData(key: string, data: any[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
