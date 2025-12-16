import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogActivityService } from '../../../services/logActivity';

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity-logs.html',
  styleUrls: ['./activity-logs.css']
})
export class ActivityLogsComponent implements OnInit {
  logs: any[] = [];
  filteredLogs: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;

  constructor(private logService: LogActivityService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs() {
    this.isLoading = true;
    this.logService.getAll().subscribe({
      next: (res) => {
        this.logs = res;
        this.filteredLogs = [...this.logs];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load logs', err);
        this.isLoading = false;
      }
    });
  }

  searchLogs() {
    this.filteredLogs = this.logs.filter(log =>
      log.user_id?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  clearLogs() {
    if (confirm('Are you sure you want to clear all activity logs?')) {
      this.logService.clearAll().subscribe({
        next: () => {
          alert('All logs cleared.');
          this.logs = [];
          this.filteredLogs = [];
        },
        error: (err) => {
          console.error('Failed to clear logs', err);
          alert('Failed to clear logs.');
        }
      });
    }
  }
}
