import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../../services/session.service';

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

  newSession: any = {
    date: '', timeStart: '', timeEnd: '', title: '', venue: '', speaker: '', type: 'Keynote'
  };

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions() {
      this.sessionService.getAllSessions().subscribe({
        next: (data: any[]) => { // Added : any[]
          console.log('✅ Raw SQL Data from Backend:', data);
          this.processBackendData(data);
        },
        error: (err: any) => console.error('❌ Error fetching sessions:', err) // Added : any
      });
    }

  processBackendData(data: any[]) {
    const validSessions = [];

    for (const item of data) {
      const rawStart = item.start_time || item.startTime;
      const rawEnd   = item.end_time   || item.endTime;

      if (!rawStart) {
        console.warn('⚠️ Skipping session with no start_time:', item);
        continue;
      }

      try {
        const startDate = new Date(rawStart);
        const endDate = rawEnd ? new Date(rawEnd) : new Date(startDate.getTime() + 3600000); // Default +1 hour

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

    console.log('Sending Payload:', payload);

        this.sessionService.createSession(payload).subscribe({
          next: (savedData: any) => {
            console.log('Saved to Backend:', savedData);
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
      title: '',
      date: '',
      timeStart: '',
      timeEnd: '',
      venue: '',
      speaker: '',
      type: 'Keynote',
      chair_id: null
    };
    console.log('Form data has been reset');
  }

  deleteSession(id: number) {
    if(confirm('Delete?')) {
      this.sessionService.deleteSession(id).subscribe(() => this.loadSessions());
    }
  }
}
