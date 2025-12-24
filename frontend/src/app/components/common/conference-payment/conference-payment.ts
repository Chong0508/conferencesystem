import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router'; //
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-conference-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // Fixed NG8002 error
  templateUrl: './conference-payment.html',
  styleUrl: './conference-payment.css'
})
export class ConferencePayment implements OnInit {
  registrationData: any;
  conference: any;
  selectedFile: File | null = null;
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
  }

  ngOnInit(): void {
    if (!this.registrationData) {
      this.router.navigate(['/dashboard/conferences']);
      return;
    }
    this.loadConference();
  }

  loadConference() {
    this.http.get<any>(`http://localhost:8080/api/conferences/${this.registrationData.conference_id}`)
      .subscribe(res => this.conference = res);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  processPayment() {
    if (!this.selectedFile) return alert("Please upload a receipt.");
    this.isProcessing = true;

    this.http.post<any>('http://localhost:8080/api/registrations', this.registrationData).subscribe({
      next: (reg) => {
        const paymentData = {
          registration_id: reg.registration_id,
          amount: this.amount,
          currency: 'MYR',
          status: 'Completed',
          receipt_file: this.selectedFile?.name 
        };

        this.http.post('http://localhost:8080/api/payments', paymentData).subscribe({
          next: () => {
            const user = this.authService.getLoggedUser();
            this.notificationService.addNotification({
              title: 'Payment Successful',
              message: `Your payment for ${this.conference?.acronym} was received.`,
              type: 'success',
              recipientEmail: user.email,
            });
            this.isProcessing = false;
            this.router.navigate(['/dashboard/conferences']);
          }
        });
      }
    });
  }
}