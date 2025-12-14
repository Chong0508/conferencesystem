import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  // 必须和 AuthService 里的 logStorageKey 保持一致
  private storageKey = 'mock_activity_logs';

  constructor() { }

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs() {
    const data = localStorage.getItem(this.storageKey);

    if (data) {
      this.logs = JSON.parse(data);
      this.filteredLogs = [...this.logs];
    } else {
      // 👇 只有这一句：如果没有数据，就是空数组。绝不生成假数据。
      this.logs = [];
      this.filteredLogs = [];
    }
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
      this.logs = [];
      this.filteredLogs = [];
      localStorage.removeItem(this.storageKey);
    }
  }
}
