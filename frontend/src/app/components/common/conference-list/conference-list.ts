import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { ConferenceService } from '../../../services/conference';

@Component({
  selector: 'app-conference-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conference-list.html',
  styleUrl: './conference-list.css',
})
export class ConferenceList implements OnInit {

  conferences: any[] = [];
  currentUserRole: string = '';

  constructor(
    private conferenceService: ConferenceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getLoggedUser();
    if (user) {
      this.currentUserRole = user.role;
    }

    this.loadConferences();
  }

  loadConferences() {
    this.conferenceService.getAllConferences().subscribe(data => {
      this.conferences = data;
    });
  }

  isAuthor() {
    return this.currentUserRole === 'Author';
  }

  isAdmin() {
    return this.currentUserRole === 'Admin';
  }

  isReviewer() {
    return this.currentUserRole === 'Reviewer';
  }

  viewConferenceDetails(conferenceId: number) {
    this.router.navigate(['/conference-details', conferenceId]);
  }

  joinConference(conferenceId: number) {
    // Dapatkan user yang sedang log masuk
    const user = this.authService.getLoggedUser();

    if (user) {
      // Simpan data pendaftaran conference
      const registrationData = {
        conferenceId: conferenceId,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        registrationDate: new Date(),
        status: 'Registered'
      };

      // Panggil service untuk daftar
      this.conferenceService.createRegistration(registrationData).subscribe(response => {
        if (response.success) {
          alert('Anda telah berjaya mendaftar untuk conference!');
          // Optional: Refresh conference list untuk tunjuk status baru
          this.loadConferences();
        } else {
          alert('Ralat berlaku semasa mendaftar. Sila cuba lagi.');
        }
      });
    }
  }

  editConference(conferenceId: number) {
    this.router.navigate(['/dashboard/edit-conference', conferenceId]);
  }

  deleteConference(conferenceId: number) {
    if (confirm('Are you sure you want to delete this conference?')) {
      this.conferenceService.deleteConference(conferenceId).subscribe(() => {
        this.loadConferences();
      });
    }
  }
}
