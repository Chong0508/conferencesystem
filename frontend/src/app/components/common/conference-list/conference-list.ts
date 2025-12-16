import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { ConferenceService } from '../../../services/conference'; // ✅ Correct place for this

@Component({
  selector: 'app-conference-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conference-list.html',
  styleUrl: './conference-list.css',
})
export class ConferenceList implements OnInit {

  conferences: any[] = [];
  currentUser: any = null;

  constructor(
    private conferenceService: ConferenceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getLoggedUser();
    this.loadConferences();
  }

  loadConferences() {
    // Fetch all conferences
    this.conferenceService.getAllConferences().subscribe(data => {
      // Optional: If you want to filter like your teammate did (Active only)
      // For now, we show all, but you can uncomment the filter below:

      // this.conferences = data.filter(c => c.status === 'Ongoing' || c.status === 'Upcoming');
      this.conferences = data;
    });
  }

  // --- Role Helpers ---
  isAuthor() {
    return this.currentUser?.role === 'Author';
  }

  isReviewer() {
    return this.currentUser?.role === 'Reviewer';
  }

  isAdmin() {
    return this.currentUser?.role === 'Admin';
  }

  // --- Actions ---

  // 1. Register (For Author)
  joinConference(conference: any) {
    if (!this.currentUser) return;

    if (confirm(`Do you want to register for "${conference.title}"?`)) {

      const registrationData = {
        conferenceId: conference.id,
        conferenceTitle: conference.title,
        userId: this.currentUser.email,
        userEmail: this.currentUser.email,
        userName: this.currentUser.firstName + ' ' + this.currentUser.lastName,
        registrationDate: new Date(),
        status: 'Registered',
        fee: 150
      };

      this.conferenceService.createRegistration(registrationData).subscribe(response => {
        if (response.success) {
          alert('✅ You have successfully registered!');
        }
      });
    }
  }

  // 2. Edit (For Admin)
  editConference(id: number) {
    this.router.navigate(['/dashboard/create-conference']);
  }
}
