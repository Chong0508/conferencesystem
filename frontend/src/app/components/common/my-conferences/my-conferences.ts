import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ConferenceService } from '../../../services/conference.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-conferences',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-conferences.html',
  styleUrl: './my-conferences.css'
})
export class MyConferences implements OnInit {
  participatedConferences: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private confService: ConferenceService
  ) {}

  ngOnInit(): void {
    this.loadMyRegistrations();
  }

  loadMyRegistrations() {
    const user = this.authService.getLoggedUser();
    if (!user) return;

    const currentUserId = user.userId || user.user_id;
    this.isLoading = true;

    // 1. Fetch all registrations
    this.http.get<any[]>(`${environment.apiUrl}/api/registrations`).subscribe({
      next: (registrations) => {
        // 2. Filter by User ID and 'Approved' status
        const myApprovedRegs = registrations.filter(reg => 
          reg.user_id === currentUserId && reg.payment_status === 'Approved'
        );

        if (myApprovedRegs.length === 0) {
          this.participatedConferences = [];
          this.isLoading = false;
          return;
        }

        // 3. Get Full Conference Details for each registration
        this.confService.getAllConferences().subscribe({
          next: (conferences) => {
            this.participatedConferences = myApprovedRegs.map(reg => {
              const details = conferences.find(c => c.conference_id === reg.conference_id);
              return {
                ...reg,
                conferenceDetails: details
              };
            });
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Failed to load your registrations.';
        this.isLoading = false;
      }
    });
  }
}