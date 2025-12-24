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
  
  // Property to hold the current Malaysia time (UTC+8)
  currentMalaysiaTime: Date = new Date();

  constructor(private confService: ConferenceService) {}

  ngOnInit() {
    this.updateMalaysiaTime();
    this.loadConferences();
  }

  /**
   * Sets the clock to Malaysia Standard Time (UTC+8)
   */
  updateMalaysiaTime() {
    const now = new Date();
    // Calculate UTC time then add 8 hours for Malaysia
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    this.currentMalaysiaTime = new Date(utc + (3600000 * 8));
  }

  loadConferences() {
    this.isLoading = true;
    this.confService.getAllConferences().subscribe({
      next: (data) => {
        // 1. Process data to calculate status based on Malaysia Time
        const processedData = data.map((conf: any) => {
          const status = this.calculateStatus(conf.start_date);
          return { ...conf, computedStatus: status };
        });

        // 2. Sort: Pin 'Active' conferences to the top, then 'Inactive'
        this.conferenceList = processedData.sort((a, b) => {
          if (a.computedStatus === 'Active' && b.computedStatus === 'Inactive') return -1;
          if (a.computedStatus === 'Inactive' && b.computedStatus === 'Active') return 1;
          return 0;
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Fetch error:', err);
        this.errorMessage = 'Could not load conferences. Please verify the backend service.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Logic: Active if current Malaysia date is before or strictly equal to the start date.
   * If today's date (MYT) has passed the start date, it is marked Inactive.
   */
  calculateStatus(startDateStr: string): string {
    if (!startDateStr) return 'Inactive';

    // Get today's date in Malaysia as YYYY-MM-DD
    const todayStr = this.currentMalaysiaTime.toISOString().split('T')[0];
    
    // Direct string comparison works for YYYY-MM-DD formats
    return todayStr <= startDateStr ? 'Active' : 'Inactive';
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'bg-success' : 'bg-danger';
  }
}