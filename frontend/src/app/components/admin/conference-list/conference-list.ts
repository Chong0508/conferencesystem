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
        this.conferenceList = data;
        this.isLoading = false;
        console.log('Loaded conferences:', data);
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = 'Could not load conferences. Is the Backend running?';
        this.isLoading = false;
      }
    });
  }

  // Helper to determine Badge Color based on status
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'upcoming': return 'bg-success';
      case 'ongoing': return 'bg-warning text-dark';
      case 'past': return 'bg-secondary';
      case 'closed': return 'bg-danger';
      default: return 'bg-primary'; // Default color
    }
  }
}
