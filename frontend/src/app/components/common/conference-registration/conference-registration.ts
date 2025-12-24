import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConferenceService } from '../../../services/conference.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-conference-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './conference-registration.html',
  styleUrl: './conference-registration.css'
})
export class ConferenceRegistration implements OnInit {
  conference: any = null;
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  registrationData: any = {
    user_id: null,
    conference_id: null,
    registration_type: 'Listener',
    early_bird: false,
    payment_status: 'Pending'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private confService: ConferenceService
  ) {}

  ngOnInit(): void {
    const confId = this.route.snapshot.paramMap.get('id');
    const user = this.authService.getCurrentUser();

    if (confId && user) {
      this.registrationData.conference_id = Number(confId);
      this.registrationData.user_id = user.user_id || user.id;
      this.fetchConferenceDetails(this.registrationData.conference_id);
      this.calculateEarlyBirdStatus();
    } else {
      this.router.navigate(['/login']);
    }
  }

  fetchConferenceDetails(id: number) {
    this.isLoading = true;
    this.confService.getConferenceById(id).subscribe({
      next: (data) => {
        this.conference = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  calculateEarlyBirdStatus() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const malaysiaTime = new Date(utc + (3600000 * 8));
    // Example logic: Early bird is active if today is 2025 or earlier
    this.registrationData.early_bird = malaysiaTime.getFullYear() <= 2025;
  }

  onSubmit() {
    this.isSubmitting = true;
    // Do not save to DB. Pass data to payment page.
    this.router.navigate(['/dashboard/conference-payment'], {
      state: { data: this.registrationData, conferenceAcronym: this.conference.acronym }
    });
  }
}