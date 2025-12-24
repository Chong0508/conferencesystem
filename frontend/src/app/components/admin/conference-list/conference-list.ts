import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConferenceService } from '../../../services/conference.service';

@Component({
  selector: 'app-conference-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './conference-list.html',
  styleUrl: './conference-list.css',
})
export class ConferenceList implements OnInit {

  conferenceList: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private confService: ConferenceService) {}

  ngOnInit() {
    this.loadConferences();
  }

  loadConferences() {
    this.isLoading = true;
    this.confService.getAllConferences().subscribe({
      next: (data) => {
        // 1. Map through data to calculate Active/Inactive status based on Malaysia Time
        const processedData = data.map((conf: any) => {
          const status = this.calculateStatus(conf.start_date);
          return { ...conf, computedStatus: status };
        });

        // 2. Sort: Active (alphabetical A first) then Inactive
        this.conferenceList = processedData.sort((a, b) => {
          if (a.computedStatus === 'Active' && b.computedStatus === 'Inactive') return -1;
          if (a.computedStatus === 'Inactive' && b.computedStatus === 'Active') return 1;
          return 0;
        });

        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Could not load conferences. Is the Backend running?';
        this.isLoading = false;
      }
    });
  }

  calculateStatus(startDateStr: string): string {
    if (!startDateStr) return 'Inactive';

    // Get Current Malaysia Time (UTC+8)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const malaysiaTime = new Date(utc + (3600000 * 8));
    
    // Convert Malaysia Time to a YYYY-MM-DD string for date-only comparison
    const todayStr = malaysiaTime.toISOString().split('T')[0];

    // Compare: If today is before or on the start date, it is Active
    // If today is after the start date, it is Inactive (Closed)
    return todayStr <= startDateStr ? 'Active' : 'Inactive';
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'bg-success' : 'bg-danger';
  }
}