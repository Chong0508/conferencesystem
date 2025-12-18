import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LogActivityService, LogActivity } from '../../../services/log-activity.service';
import { UserService } from '../../../services/user.service';

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

  userMap: { [key: number]: string } = {};

  constructor(
    private logActivityService: LogActivityService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadUsersAndLogs();
  }

  loadUsersAndLogs() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        users.forEach((u: any) => {
          const id = u.user_id || u.id;
          this.userMap[id] = `${u.first_name || u.firstName} ${u.last_name || u.lastName}`;
        });

        this.loadLogs();
      },
      error: (err) => {
        console.error('Failed to load users, logs will show IDs instead:', err);
        this.loadLogs(); // Fallback: load logs anyway
      }
    });
  }

  loadLogs() {
    this.logActivityService.getAllLogs().subscribe({
      next: (data) => this.processBackendData(data),
      error: (err) => console.error('Error fetching logs:', err)
    });
  }

  processBackendData(data: LogActivity[]) {
    this.logs = data.map(item => ({
      id: item.log_id || 0,

      user: this.userMap[item.user_id] || `User #${item.user_id}`,

      role: 'User',
      action: item.action || 'Unknown',
      details: item.details || '',
      timestamp: item.login_time ? new Date(item.login_time).toLocaleString() : '-',
      type: this.determineLogType(item.action)
    }));

    this.filteredLogs = [...this.logs].reverse();
  }

  determineLogType(action: string): 'info' | 'warning' | 'success' | 'danger' {
    const act = (action || '').toLowerCase();
    if (act.includes('delete') || act.includes('error')) return 'danger';
    if (act.includes('warning') || act.includes('update')) return 'warning';
    if (act.includes('success') || act.includes('login') || act.includes('register')) return 'success';
    return 'info';
  }

  // --- Search Logic ---
  searchLogs() {
    const term = this.searchTerm.toLowerCase();
    this.filteredLogs = this.logs.filter(log =>
      log.user.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term) ||
      log.details.toLowerCase().includes(term)
    );
  }

  // --- Clear All Logs ---
  clearLogs() {
    if(confirm('Are you sure you want to clear ALL activity logs? This cannot be undone.')) {

      const deletePromises = this.logs.map(log =>
        this.logActivityService.deleteLog(log.id).toPromise()
      );

      Promise.all(deletePromises)
        .then(() => {
          alert('All logs cleared successfully!');
          this.loadUsersAndLogs(); // Reload
        })
        .catch(err => {
          console.error('Error clearing logs:', err);
          alert('Failed to clear some logs. Check console.');
        });
    }
  }

  // --- Delete Single Log ---
  deleteLog(logId: number) {
    if(confirm('Delete this log entry?')) {
      this.logActivityService.deleteLog(logId).subscribe({
        next: () => {
          alert('Log deleted successfully!');
          this.loadLogs(); // Refresh list
        },
        error: (err) => {
          console.error('Error deleting log:', err);
          alert('Failed to delete log.');
        }
      });
    }
  }
}
