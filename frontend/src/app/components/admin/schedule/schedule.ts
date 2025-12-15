import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 👇 Import ConferenceService (Assuming sessions are part of conference)
import { ConferenceService } from '../../../services/conference';

// Define Session Interface
interface Session {
  id: number;
  timeStart: string; // e.g., "09:00"
  timeEnd: string;   // e.g., "10:00"
  title: string;
  speaker: string;
  venue: string;
  day: string;       // "Day 1", "Day 2"
  type: string;      // "Keynote", "Workshop", "Break"
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.html',
  styleUrls: ['./schedule.css']
})
export class ScheduleComponent implements OnInit {

  sessions: Session[] = [];
  filteredSessions: Session[] = [];

  // Currently selected day (Default Day 1)
  selectedDay: string = 'Day 1';
  days: string[] = ['Day 1', 'Day 2', 'Day 3'];

  // Control "Add Session" form visibility
  showForm: boolean = false;

  // Model for new Session
  newSession: Session = {
    id: 0,
    day: 'Day 1',
    timeStart: '',
    timeEnd: '',
    title: '',
    speaker: '',
    venue: '',
    type: 'Keynote'
  };

  // 👇 Inject Service
  constructor(private conferenceService: ConferenceService) { }

  ngOnInit(): void {
    this.loadSessions();
  }

  // --- Load Data ---
  loadSessions() {
    // 👇 Use Service to get sessions
    // Note: Ensure getAllSessions() exists in ConferenceService
    this.conferenceService.getAllSessions().subscribe((data: any[]) => {
      this.sessions = data;
      this.filterByDay();
    });
  }

  // --- Filter by Day ---
  selectDay(day: string) {
    this.selectedDay = day;
    this.filterByDay();
  }

  filterByDay() {
    // Simple sort: sort by start time
    this.filteredSessions = this.sessions
      .filter(s => s.day === this.selectedDay)
      .sort((a, b) => a.timeStart.localeCompare(b.timeStart));
  }

  // --- Add Session ---
  toggleForm() {
    this.showForm = !this.showForm;
  }

  addSession() {
    if (this.newSession.title && this.newSession.timeStart) {

      // 👇 Use Service to add session
      this.conferenceService.addSession(this.newSession).subscribe(() => {
        this.loadSessions(); // Refresh list

        // Reset Form
        this.showForm = false;
        this.resetForm();
        alert('Session added successfully!');
      });

    } else {
      alert('Please fill in Title and Start Time.');
    }
  }

  resetForm() {
    this.newSession = { id: 0, day: this.selectedDay, timeStart: '', timeEnd: '', title: '', speaker: '', venue: '', type: 'Keynote' };
  }

  // --- Delete Session ---
  deleteSession(id: number) {
    if (confirm('Delete this session?')) {
      // 👇 Use Service to delete session
      this.conferenceService.deleteSession(id).subscribe(() => {
        this.loadSessions(); // Refresh list
      });
    }
  }
}
