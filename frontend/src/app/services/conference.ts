// File: frontend/src/app/services/conference.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { NotificationService } from './notification';

// Define interfaces for type safety
export interface Conference {
  id: number | string;
  name: string;
  date?: string;
  location?: string;
  description?: string;
  status?: string; // Added status property
}

export interface Track {
  id: number | string;
  name: string;
  description?: string;
  conferenceId?: string;
}

export interface Session {
  id: number | string;
  name: string;
  conference: string;
  date: string;
  time: string;
  // Additional properties that might be used in components
  title?: string;
  trackId?: string;
  speakerId?: string;
  description?: string;
}

export interface Registration {
  id?: number | string; // Made id optional since it's generated in the service
  conferenceId: number | string;
  userId?: number | string;
  userEmail?: string;
  userName?: string;
  paperId?: number | string;
  amount?: number;
  details?: any;
  date?: Date;
  registrationDate?: Date;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {
  private trackStorageKey = 'mock_tracks';
  private confStorageKey = 'mock_conferences';
  private sessionStorageKey = 'mock_sessions';
  private regStorageKey = 'mock_registrations';

  constructor(private notificationService: NotificationService) { }

  // ==========================================
  // 1. Track Management
  // ==========================================
  getAllTracks(): Observable<Track[]> {
    const data = localStorage.getItem(this.trackStorageKey);
    let tracks = data ? JSON.parse(data) : [
      { id: 1, name: 'Artificial Intelligence (AI)' },
      { id: 2, name: 'Software Engineering' },
      { id: 3, name: 'Cybersecurity' }
    ];
    if (!data) {
      localStorage.setItem(this.trackStorageKey, JSON.stringify(tracks));
    }
    return of(tracks).pipe(delay(300));
  }

  addTrack(trackName: string): Observable<Track> {
    const tracks = this.getDataFromStorage(this.trackStorageKey);
    const newTrack = { id: tracks.length + 1, name: trackName };
    tracks.push(newTrack);
    this.saveDataToStorage(this.trackStorageKey, tracks);

    // Add notification
    this.notificationService.addNotification({
      title: 'Success',
      message: `Track "${trackName}" added successfully`,
      type: 'success'
    });

    return of(newTrack).pipe(delay(300));
  }

  updateTrack(updatedTrack: Track): Observable<Track> {
    const tracks = this.getDataFromStorage(this.trackStorageKey);
    const index = tracks.findIndex((t: Track) => t.id === updatedTrack.id);
    if (index !== -1) {
      tracks[index] = updatedTrack;
      this.saveDataToStorage(this.trackStorageKey, tracks);

      // Add notification
      this.notificationService.addNotification({
        title: 'Success',
        message: `Track "${updatedTrack.name}" updated successfully`,
        type: 'success'
      });

      return of(updatedTrack).pipe(delay(300));
    }
    // Return a default track instead of null to match the expected return type
    return of({ id: -1, name: 'Not Found' }).pipe(delay(300));
  }

  deleteTrack(id: number | string): Observable<{ success: boolean }> {
    let tracks = this.getDataFromStorage(this.trackStorageKey);
    const trackName = tracks.find((t: Track) => t.id === id)?.name;
    tracks = tracks.filter((t: Track) => t.id !== id);
    this.saveDataToStorage(this.trackStorageKey, tracks);

    // Add notification
    this.notificationService.addNotification({
      title: 'Success',
      message: `Track "${trackName}" deleted successfully`,
      type: 'success'
    });

    return of({ success: true });
  }

  // ==========================================
  // 2. Conference Management
  // ==========================================
  getAllConferences(): Observable<Conference[]> {
    const data = localStorage.getItem(this.confStorageKey);
    let conferences = data ? JSON.parse(data) : [
      { id: 1, name: 'G5Conf 2024', date: '2024-12-20', location: 'Kuala Lumpur', description: 'Annual conference for the G5 project.', status: 'Upcoming' },
      { id: 2, name: 'Tech Talk Asia', date: '2025-03-15', location: 'Singapore', description: 'A conference on the latest technology.', status: 'Ongoing' }
    ];
    if (!data) {
      localStorage.setItem(this.confStorageKey, JSON.stringify(conferences));
    }
    return of(conferences).pipe(delay(300));
  }

  getConference(id: string | number): Observable<Conference | undefined> {
    return this.getAllConferences().pipe(
      map(conferences => conferences.find(c => c.id === id))
    );
  }

  // Alias for getConference to fix the error
  getConferenceById(id: string | number): Observable<Conference | undefined> {
    return this.getConference(id);
  }

  createConference(confData: Conference): Observable<{ success: boolean }> {
    const conferences = this.getDataFromStorage(this.confStorageKey);
    confData.id = Date.now();
    conferences.push(confData);
    this.saveDataToStorage(this.confStorageKey, conferences);

    // Add notification
    this.notificationService.addNotification({
      title: 'Success',
      message: `Conference "${confData.name}" created successfully`,
      type: 'success'
    });

    return of({ success: true }).pipe(delay(500));
  }

  updateConference(updatedConf: Conference): Observable<{ success: boolean }> {
    const conferences = this.getDataFromStorage(this.confStorageKey);
    const index = conferences.findIndex((c: Conference) => c.id === updatedConf.id);
    if (index !== -1) {
      conferences[index] = updatedConf;
      this.saveDataToStorage(this.confStorageKey, conferences);

      // Add notification
      this.notificationService.addNotification({
        title: 'Success',
        message: `Conference "${updatedConf.name}" updated successfully`,
        type: 'success'
      });

      return of({ success: true }).pipe(delay(500));
    }
    return of({ success: false });
  }

  deleteConference(id: number | string): Observable<{ success: boolean }> {
    let conferences = this.getDataFromStorage(this.confStorageKey);
    const confName = conferences.find((c: Conference) => c.id === id)?.name;
    conferences = conferences.filter((c: Conference) => c.id !== id);
    this.saveDataToStorage(this.confStorageKey, conferences);

    // Add notification
    this.notificationService.addNotification({
      title: 'Success',
      message: `Conference "${confName}" deleted successfully`,
      type: 'success'
    });

    return of({ success: true });
  }

  // ==========================================
  // 3. Session Management
  // ==========================================
  getAllSessions(): Observable<Session[]> {
    const data = localStorage.getItem(this.sessionStorageKey);
    let sessions = data ? JSON.parse(data) : [
      { id: 1, name: 'Opening Keynote', title: 'Opening Keynote', conference: 'G5Conf 2024', date: '2024-12-20', time: '09:00 AM' },
      { id: 2, name: 'AI Workshop', title: 'AI Workshop', conference: 'G5Conf 2024', date: '2024-12-20', time: '11:00 AM' }
    ];
    if (!data) {
      localStorage.setItem(this.sessionStorageKey, JSON.stringify(sessions));
    }
    return of(sessions).pipe(delay(300));
  }

  addSession(sessionData: any): Observable<{ success: boolean }> {
    // Accept any type of session data and adapt it to our interface
    const sessions = this.getDataFromStorage(this.sessionStorageKey);
    const newSession: Session = {
      id: sessions.length + 1,
      name: sessionData.name || sessionData.title || 'Untitled Session',
      title: sessionData.title || sessionData.name || 'Untitled Session',
      conference: sessionData.conference || 'Unknown Conference',
      date: sessionData.date || new Date().toISOString().split('T')[0],
      time: sessionData.time || '09:00 AM',
      trackId: sessionData.trackId,
      speakerId: sessionData.speakerId,
      description: sessionData.description
    };

    sessions.push(newSession);
    this.saveDataToStorage(this.sessionStorageKey, sessions);

    // Add notification
    this.notificationService.addNotification({
      title: 'Success',
      message: `Session "${newSession.name}" added successfully`,
      type: 'success'
    });

    return of({ success: true }).pipe(delay(300));
  }

  deleteSession(id: number | string): Observable<{ success: boolean }> {
    let sessions = this.getDataFromStorage(this.sessionStorageKey);
    const sessionName = sessions.find((s: Session) => s.id === id)?.name;
    sessions = sessions.filter((s: Session) => s.id !== id);
    this.saveDataToStorage(this.sessionStorageKey, sessions);

    // Add notification
    this.notificationService.addNotification({
      title: 'Success',
      message: `Session "${sessionName}" deleted successfully`,
      type: 'success'
    });

    return of({ success: true });
  }

  // ==========================================
  // 4. Registration Management
  // ==========================================
  createRegistration(regData: any): Observable<{ success: boolean }> {
    // Accept any type of registration data and adapt it to our interface
    const registrations = this.getDataFromStorage(this.regStorageKey);
    const newRegistration: Registration = {
      id: Date.now(),
      conferenceId: regData.conferenceId,
      userId: regData.userId,
      userEmail: regData.userEmail,
      userName: regData.userName,
      paperId: regData.paperId,
      amount: regData.amount || 0,
      details: regData.details,
      date: new Date(),
      registrationDate: regData.registrationDate || new Date(),
      status: regData.status || 'Confirmed'
    };

    registrations.push(newRegistration);
    this.saveDataToStorage(this.regStorageKey, registrations);

    // Add notification
    this.notificationService.addNotification({
      title: 'Success',
      message: 'Registration created successfully',
      type: 'success'
    });

    return of({ success: true }).pipe(delay(500));
  }

  // ==========================================
  // 5. Internal Helpers
  // ==========================================
  private getDataFromStorage(key: string): any[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveDataToStorage(key: string, data: any[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
