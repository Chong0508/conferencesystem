import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-conference-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conference-payment.html',
  styleUrl: './conference-payment.css'
})
export class ConferencePayment implements OnInit {
  registrationData: any;
  conference: any;
  selectedFile: File | null = null;
  isProcessing: boolean = false;
  
  // Set default fee (You can adjust this based on registration_type)
  amount: number = 250.00; 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    // Retrieve the data passed from the Registration step via Router State
    const navigation = this.router.getCurrentNavigation();
    this.registrationData = navigation?.extras.state?.['data'];
  }

  ngOnInit(): void {
    if (!this.registrationData) {
      alert("Registration session expired. Please try again.");
      this.router.navigate(['/dashboard/conferences']);
      return;
    }
    // Fetch conference details to show the acronym/title on this page
    this.loadConferenceDetails();
  }

  loadConferenceDetails() {
    this.http.get<any>(`http://localhost:8080/api/conferences/${this.registrationData.conference_id}`)
      .subscribe(res => this.conference = res);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  processPayment() {
    if (!this.selectedFile) {
      alert("Please upload your bank transfer receipt.");
      return;
    }

    this.isProcessing = true;

    // STEP 1: Create the Registration record first
    this.http.post<any>('http://localhost:8080/api/registrations', this.registrationData).subscribe({
      next: (regResponse) => {
        
        // STEP 2: Create the Payment record using the returned registration_id
        const paymentData = {
          registration_id: regResponse.registration_id,
          amount: this.amount,
          currency: 'MYR',
          status: 'Completed',
          receipt_file: this.selectedFile?.name 
        };

        this.http.post('http://localhost:8080/api/payments', paymentData).subscribe({
          next: () => {
            
            // STEP 3: Trigger Notification
            const user = this.authService.getLoggedUser();

            this.notificationService.addNotification({
              title: 'Payment Successful',
              message: `Your payment for ${this.conference?.acronym || 'the conference'} has been received.`,
              type: 'success',           
              recipientEmail: user.email 
            });

            this.isProcessing = false;
            alert("Registration and Payment successful!");
            this.router.navigate(['/dashboard/conference-detail', this.registrationData.conference_id]);
          },
          error: () => {
            this.isProcessing = false;
            alert("Payment record failed, but registration was saved. Please contact support.");
          }
        });
      },
      error: () => {
        this.isProcessing = false;
        alert("Registration failed. Please try again.");
      }
    });
  }
}