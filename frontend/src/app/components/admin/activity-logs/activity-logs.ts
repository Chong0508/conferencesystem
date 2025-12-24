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
  isLoading: boolean = true;
  errorMessage: string = '';

  userMap: { [key: number]: string } = {};

  constructor(
    private logActivityService: LogActivityService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadUsersAndLogs();
  }

  loadUsersAndLogs() {
    this.isLoading = true;
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
      next: (data) => {
        this.processBackendData(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching logs:', err);
        this.errorMessage = 'Failed to load activity logs';
        this.isLoading = false;
      }
    });
  }

  processBackendData(data: LogActivity[]) {
    this.logs = data.map(item => {
      // 1. Get user info from map, fallback to Guest if user_id is null
      const userName = item.user_id ? (this.userMap[item.user_id] || `User #${item.user_id}`) : 'Guest / System';
      
      return {
        id: item.log_id || 0,
        user: userName,
        role: item.user_id ? 'Member' : 'Public', // You can refine this logic
        action: item.action || 'Unknown',
        details: item.details || '',
        // Use login_time or current date as fallback
        timestamp: item.login_time ? new Date(item.login_time).toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' }) : '-',
        type: this.determineLogType(item.action)
      };
    });

    // Sort by ID descending (newest first)
    this.filteredLogs = [...this.logs].sort((a, b) => b.id - a.id);
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
          alert('✅ All logs cleared successfully!');
          this.loadUsersAndLogs(); // Reload
        })
        .catch(err => {
          console.error('Error clearing logs:', err);
          alert('❌ Failed to clear some logs. Check console.');
        });
    }
  }

  // --- Delete Single Log ---
  deleteLog(logId: number) {
    if(confirm('Delete this log entry?')) {
      this.logActivityService.deleteLog(logId).subscribe({
        next: () => {
          alert('✅ Log deleted successfully!');
          this.loadLogs(); // Refresh list
        },
        error: (err) => {
          console.error('Error deleting log:', err);
          alert('❌ Failed to delete log.');
        }
      });
    }
  }
}
