import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ConferenceService } from '../../../services/conference.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-conference-list',
  standalone: true,
  imports: [
    CommonModule,     // *ngIf, *ngFor, ngClass
    RouterModule,     // routerLink
    FormsModule,      // ngModel
    DatePipe          // ✅ date pipe (THIS FIXES THE ERROR)
  ],
  templateUrl: './conference-list.html',
  styleUrl: './conference-list.css',
})
export class ConferenceList implements OnInit {

  conferenceList: any[] = [];
  filteredList: any[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';           // ✅ EXISTS
  isAdmin = false;
  currentMalaysiaTime = new Date();

  constructor(
    private confService: ConferenceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkAccess();
    this.updateMalaysiaTime();
    this.loadConferences();
  }

  updateMalaysiaTime() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    this.currentMalaysiaTime = new Date(utc + 8 * 3600000);
  }

  checkAccess() {
    const user = this.authService.getLoggedUser();
    if (user) {
      this.isAdmin = user.role === 'Admin' || user.role === 'Super Admin';
    }
  }

  loadConferences() {
    this.isLoading = true;
    this.confService.getAllConferences().subscribe({
      next: (data) => {
        const todayStr = this.currentMalaysiaTime.toISOString().split('T')[0];

        this.conferenceList = data
          .map((conf: any) => ({
            ...conf,
            computedStatus: todayStr <= conf.start_date ? 'Active' : 'Inactive'
          }))
          .sort((a, b) => {
            // 1️⃣ Active first
            if (a.computedStatus === 'Active' && b.computedStatus === 'Inactive') {
              return -1;
            }
            if (a.computedStatus === 'Inactive' && b.computedStatus === 'Active') {
              return 1;
            }

            // 2️⃣ Optional: sort by start date (earlier first)
            return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
          });

        this.filteredList = [...this.conferenceList];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load conferences.';
        this.isLoading = false;
      }
    });
  }

  filterConferences() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredList = term
      ? this.conferenceList.filter(conf =>
          conf.title.toLowerCase().includes(term) ||
          conf.acronym.toLowerCase().includes(term)
        )
      : [...this.conferenceList];
  }

  deleteConference(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('Delete this conference?')) {
      this.confService.deleteConference(id).subscribe(() => {
        this.conferenceList = this.conferenceList.filter(
          c => c.conference_id !== id
        );
        this.filterConferences();
      });
    }
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'bg-success' : 'bg-danger';
  }
}
