// File: src/app/services/conference.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
// 👇 Ensure this path is correct
import { NotificationService } from './notification';

// Define interfaces for type safety
export interface Conference {
  id: number | string;
  name: string;      // Note: Some components might use 'title', mapping might be needed
  title?: string;    // Added 'title' to be safe since Admin page uses it
  date?: string;
  location?: string; // Note: Admin page uses 'venue'
  venue?: string;    // Added 'venue'
  description?: string;
  status?: string;
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
  title?: string;
  trackId?: string;
  speakerId?: string;
  description?: string;
}

export interface Registration {
  id?: number | string;
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

    // Add generic system notification
    this.notificationService.addNotification({
      title: 'Track Added',
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

      this.notificationService.addNotification({
        title: 'Track Updated',
        message: `Track "${updatedTrack.name}" updated successfully`,
        type: 'success'
      });

      return of(updatedTrack).pipe(delay(300));
    }
    return of({ id: -1, name: 'Not Found' }).pipe(delay(300));
  }

  deleteTrack(id: number | string): Observable<{ success: boolean }> {
    let tracks = this.getDataFromStorage(this.trackStorageKey);
    const trackName = tracks.find((t: Track) => t.id === id)?.name;
    tracks = tracks.filter((t: Track) => t.id !== id);
    this.saveDataToStorage(this.trackStorageKey, tracks);

    this.notificationService.addNotification({
      title: 'Track Deleted',
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

    // Default Data
    let conferences = data ? JSON.parse(data) : [
      {
        id: 1,
        name: 'G5Conf 2024',
        title: 'G5Conf 2024', // Ensure compatibility with Admin form
        date: '2024-12-20',
        location: 'Kuala Lumpur',
        venue: 'Kuala Lumpur', // Ensure compatibility
        description: 'Annual conference for the G5 project.',
        status: 'Upcoming'
      },
      {
        id: 2,
        name: 'Tech Talk Asia',
        title: 'Tech Talk Asia',
        date: '2025-03-15',
        location: 'Singapore',
        venue: 'Singapore',
        description: 'A conference on the latest technology.',
        status: 'Ongoing'
      }
    ];

    if (!data) {
      localStorage.setItem(this.confStorageKey, JSON.stringify(conferences));
    }
    return of(conferences).pipe(delay(300));
  }

  getConference(id: string | number): Observable<Conference | undefined> {
    return this.getAllConferences().pipe(
      map(conferences => conferences.find(c => String(c.id) === String(id)))
    );
  }

  getConferenceById(id: string | number): Observable<Conference | undefined> {
    return this.getConference(id);
  }

  createConference(confData: any): Observable<{ success: boolean }> {
    const conferences = this.getDataFromStorage(this.confStorageKey);
    confData.id = Date.now();

    // Map fields to ensure compatibility (Admin form uses 'title'/'venue')
    if (!confData.name && confData.title) confData.name = confData.title;
    if (!confData.location && confData.venue) confData.location = confData.venue;

    conferences.push(confData);
    this.saveDataToStorage(this.confStorageKey, conferences);

    this.notificationService.addNotification({
      title: 'Conference Created',
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

      this.notificationService.addNotification({
        title: 'Conference Updated',
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

    this.notificationService.addNotification({
      title: 'Conference Deleted',
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
      { id: 1, name: 'Opening Keynote', title: 'Opening Keynote', conference: 'G5Conf 2024', date: '2024-12-20', time: '09:00 AM' }
    ];
    if (!data) {
      localStorage.setItem(this.sessionStorageKey, JSON.stringify(sessions));
    }
    return of(sessions).pipe(delay(300));
  }

  addSession(sessionData: any): Observable<{ success: boolean }> {
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

    this.notificationService.addNotification({
      title: 'Session Added',
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

    this.notificationService.addNotification({
      title: 'Session Deleted',
      message: `Session "${sessionName}" deleted successfully`,
      type: 'success'
    });

    return of({ success: true });
  }

  // ==========================================
  // 4. Registration Management
  // ==========================================
  createRegistration(regData: any): Observable<{ success: boolean }> {
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

    // 🔥 Trigger Specific User Notification
    if (regData.userEmail) {
      this.notificationService.notifyRegistrationSuccess(
        regData.userEmail,
        regData.conferenceTitle || 'Conference'
      );
    }

    // Also Log Generic Success (optional, for Admin logs)
    this.notificationService.addNotification({
      title: 'Registration Created',
      message: `New registration for ${newRegistration.userName}`,
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
