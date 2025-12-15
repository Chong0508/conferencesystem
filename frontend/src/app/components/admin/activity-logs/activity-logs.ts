import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 👇 Import AuthService
import { AuthService } from '../../../services/auth';

interface ActivityLog {
  id: number;
  user: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'danger';
}

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity-logs.html',
  styleUrls: ['./activity-logs.css']
})
export class ActivityLogsComponent implements OnInit {

  logs: ActivityLog[] = [];
  filteredLogs: ActivityLog[] = [];
  searchTerm: string = '';

  // 👇 Inject AuthService
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs() {
    // 👇 Use Service to get logs
    // Note: You need to ensure getActivityLogs() exists in AuthService
    this.authService.getActivityLogs().subscribe(data => {
      this.logs = data;
      this.filteredLogs = [...this.logs];
    });
  }

  // Search Logic
  searchLogs() {
    const term = this.searchTerm.toLowerCase();
    this.filteredLogs = this.logs.filter(log =>
      log.user.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term) ||
      log.details.toLowerCase().includes(term)
    );
  }

  // Clear Logs
  clearLogs() {
    if(confirm('Are you sure you want to clear ALL activity logs? This cannot be undone.')) {
      // 👇 Use Service to clear logs
      this.authService.clearActivityLogs().subscribe(() => {
        this.logs = [];
        this.filteredLogs = [];
      });
    }
  }
}
