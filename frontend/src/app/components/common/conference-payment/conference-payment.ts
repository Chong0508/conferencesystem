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

    // 1. Get the user object from AuthService/LocalStorage
    const user = this.authService.getLoggedUser();
    
    // 2. Map 'userId' from LocalStorage to 'user_id' for the Java Backend
    if (user && user.userId) {
      this.registrationData.user_id = user.userId; // Matches your localStorage key
    } else if (user && user.user_id) {
      this.registrationData.user_id = user.user_id;
    }

    console.log('Final Registration Data for Backend:', this.registrationData);
  }

  processPayment() {
    if (!this.registrationData.user_id) {
      alert("Error: User session not found. Please log in again.");
      return;
    }

    this.isProcessing = true;

    // 3. Finalize data before sending to Java Registration model
    this.registrationData.payment_status = 'Approved'; // Update status
    this.registrationData.registered_at = new Date().toISOString(); // Timestamp for Java

    // 4. Atomic Save: Only saves to DB now
    this.http.post<any>('http://localhost:8080/api/registrations', this.registrationData).subscribe({
      next: (res) => {
        const user = this.authService.getLoggedUser();
        
        this.notificationService.addNotification({
          title: 'Registration Successful',
          message: `Your registration for ${this.conferenceAcronym} is now Approved.`,
          type: 'success',
          recipientEmail: user.email || 'user@example.com'
        });

        this.isProcessing = false;
        this.router.navigate(['/dashboard/conferences']);
      },
      error: (err) => {
        this.isProcessing = false;
        console.error("Backend Error:", err);
        alert("Failed to save registration. Check if user_id " + this.registrationData.user_id + " exists in the user table.");
      }
    });
  }
}