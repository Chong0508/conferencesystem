import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ConferenceService } from '../../../services/conference.service';

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

  // Initializing the model to match your Java Backend (Registration.java)
  registrationData: any = {
    user_id: null,
    conference_id: null,
    registration_type: 'Listener', // Default type
    early_bird: false,
    payment_status: 'Pending'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
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
      this.checkEarlyBird(confId);
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

  checkEarlyBird(confId: any) {
    // Logic: If current Malaysia time is before the registration deadline, it's early bird
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const malaysiaTime = new Date(utc + (3600000 * 8));
    
    // Check if the conference has an early bird property or use a generic logic
    this.registrationData.early_bird = true; // Simplified for this example
  }

  onSubmit() {
    this.isSubmitting = true;
    
    // POST to your RegistrationController
    this.http.post('http://localhost:8080/api/registrations', this.registrationData)
      .subscribe({
        next: (res) => {
          this.isSubmitting = false;
          alert('Successfully registered for ' + this.conference.acronym);
          this.router.navigate(['/dashboard/conference-detail', this.registrationData.conference_id]);
        },
        error: (err) => {
          this.isSubmitting = false;
          alert('Registration failed. Please try again.');
        }
      });
  }
}