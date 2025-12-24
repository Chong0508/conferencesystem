import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-conference-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './conference-payment.html',
  styleUrl: './conference-payment.css'
})
export class ConferencePayment implements OnInit {
  registrationData: any;
  conferenceAcronym: string = '';
  isProcessing: boolean = false;
  amount: number = 250.00;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.registrationData = navigation?.extras.state?.['data'];
    this.conferenceAcronym = navigation?.extras.state?.['conferenceAcronym'];
  }

  ngOnInit(): void {
    if (!this.registrationData) {
      this.router.navigate(['/dashboard/conferences']);
      return;
    }
    const user = this.authService.getLoggedUser();
    if (user) {
      this.registrationData.user_id = user.userId || user.user_id;
    }
  }

  processPayment() {
    if (!this.registrationData.user_id) {
      alert("Error: User session not found.");
      return;
    }

    this.isProcessing = true;

    // Finalize data for Database
    this.registrationData.payment_status = 'Approved';
    this.registrationData.registered_at = new Date().toISOString();

    // STEP 1: Save to Database
    this.http.post<any>('http://localhost:8080/api/registrations', this.registrationData).subscribe({
      next: (res) => {
        // STEP 2: Call Notification Service Safely
        // We wrap this in try-catch so if the service crashes, the navigation still works
        try {
          const user = this.authService.getLoggedUser();
          this.notificationService.addNotification({
            title: 'Registration Finalized',
            message: `You are now successfully registered for ${this.conferenceAcronym}.`,
            type: 'success',
            recipientEmail: user?.email
          });
        } catch (error) {
          console.warn("Notification Service failed, but registration was saved:", error);
        }

        // STEP 3: Navigate and Stop Loading
        this.router.navigate(['/dashboard/conferences']).then(() => {
          this.isProcessing = false;
        });
      },
      error: (err) => {
        this.isProcessing = false;
        console.error("Backend Error:", err);
        alert("Payment confirmation failed. Data not saved.");
      }
    });
  }
}