import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../../services/session.service';
// 1. IMPORT NOTIFICATION SERVICE
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.html',
  styleUrls: ['./schedule.css']
})
export class ScheduleComponent implements OnInit {

  sessions: any[] = [];
  filteredSessions: any[] = [];
  days: string[] = [];
  selectedDay: string = '';
  showForm: boolean = false;
  currentUserId: number | null = null; // Store User ID

  newSession: any = {
    date: '', timeStart: '', timeEnd: '', title: '', venue: '', speaker: '', type: 'Keynote'
  };

  constructor(
    private sessionService: SessionService,
    // 2. INJECT NOTIFICATION SERVICE
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadSessions();
  }

  // Helper to get User ID safely
  loadCurrentUser() {
    const userStr = localStorage.getItem('loggedUser') || localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserId = user.id || user.user_id || user.userId;
    }
  }

  loadSessions() {
      this.sessionService.getAllSessions().subscribe({
        next: (data: any[]) => {
          console.log('✅ Raw SQL Data from Backend:', data);
          this.processBackendData(data);
        },
        error: (err: any) => console.error('❌ Error fetching sessions:', err)
      });
    }

  processBackendData(data: any[]) {
    const validSessions = [];

    for (const item of data) {
      const rawStart = item.start_time || item.startTime;
      const rawEnd   = item.end_time   || item.endTime;

      if (!rawStart) {
        continue;
      }

      try {
        const startDate = new Date(rawStart);
        const endDate = rawEnd ? new Date(rawEnd) : new Date(startDate.getTime() + 3600000);

        validSessions.push({
          id: item.session_id || item.id,
          title: item.title || 'Untitled',
          day: startDate.toISOString().split('T')[0],
          timeStart: startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          timeEnd: endDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          venue: item.venue || 'Main Hall',
          speaker: item.speaker_name || item.speakerName || '-',
          type: item.session_type || item.sessionType || 'General'
        });

      } catch (e) {
        console.error('❌ Date Parse Error for item:', item, e);
      }
    }

    this.sessions = validSessions;
    this.days = [...new Set(this.sessions.map(s => s.day))].sort();

    if (this.days.length > 0) {
      if (!this.selectedDay || !this.days.includes(this.selectedDay)) {
        this.selectedDay = this.days[0];
      }
    }

    this.filterByDay();
  }

  selectDay(day: string) {
    this.selectedDay = day;
    this.filterByDay();
  }

  filterByDay() {
    this.filteredSessions = this.sessions
      .filter(s => s.day === this.selectedDay)
      .sort((a, b) => a.timeStart.localeCompare(b.timeStart));
  }

  addSession() {
    if (!this.newSession.title || !this.newSession.date || !this.newSession.timeStart) {
      alert('Please fill in Title, Date, and Start Time.');
      return;
    }

    const isoStartTime = `${this.newSession.date}T${this.newSession.timeStart}:00`;
    const isoEndTime = this.newSession.timeEnd
                       ? `${this.newSession.date}T${this.newSession.timeEnd}:00`
                       : isoStartTime;

    const payload = {
      title: this.newSession.title,
      start_time: isoStartTime,
      end_time: isoEndTime,
      event_id: 1,
      chair_id: 1,
      venue: this.newSession.venue,
      speaker: this.newSession.speaker,
      type: this.newSession.type
    };

    this.sessionService.createSession(payload).subscribe({
      next: (savedData: any) => {
        console.log('Saved to Backend:', savedData);

        // 3. TRIGGER NOTIFICATION (Success)
        if (this.currentUserId) {
          this.notificationService.createNotification(
            this.currentUserId,
            `Session "${this.newSession.title}" added to schedule.`,
            'success'
          );
        }

        alert('Session Successfully Saved!');
        this.toggleForm();
        this.resetForm();
        this.loadSessions();
      },
      error: (err: any) => {
        console.error('Save Failed:', err);
        alert('Failed to save. Check Console for errors.');
      }
    });
  }

  toggleForm() { this.showForm = !this.showForm; }

  resetForm() {
    this.newSession = {
      title: '', date: '', timeStart: '', timeEnd: '', venue: '', speaker: '', type: 'Keynote', chair_id: null
    };
  }

  deleteSession(id: number) {
    if(confirm('Delete this session?')) {
      this.sessionService.deleteSession(id).subscribe({
        next: () => {
          // 4. TRIGGER NOTIFICATION (Deletion Warning)
          if (this.currentUserId) {
            this.notificationService.createNotification(
              this.currentUserId,
              'Session removed from schedule.',
              'warning'
            );
          }
          this.loadSessions();
        },
        error: (err: any) => console.error('Delete failed', err)
      });
    }
  }
}
