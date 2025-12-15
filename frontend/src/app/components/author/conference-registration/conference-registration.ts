import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// 👇 Import Services
import { PaperService } from '../../../services/paper';
import { ConferenceService } from '../../../services/conference';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-conference-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conference-registration.html',
  styleUrl: './conference-registration.css'
})
export class ConferenceRegistration implements OnInit {

  paperId: any;
  paper: any = null;
  currentUser: any = {};

  // Registration Form Data
  regForm: any = {
    fullName: '',
    organization: '',
    dietary: 'None',
    paymentMethod: 'Credit Card'
  };

  // Fees
  registrationFee: number = 150;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paperService: PaperService,          // 👈 Inject PaperService
    private conferenceService: ConferenceService,// 👈 Inject ConferenceService
    private authService: AuthService             // 👈 Inject AuthService
  ) {}

  ngOnInit() {
    this.paperId = this.route.snapshot.paramMap.get('paperId');

    // Load User Data via AuthService
    const localUser = this.authService.getLoggedUser();
    if (localUser) {
      this.currentUser = localUser;
      this.regForm.fullName = this.currentUser.firstName + ' ' + this.currentUser.lastName;
    }

    this.loadPaper();
  }

  loadPaper() {
    // Fetch paper details via Service
    if (this.paperId) {
      this.paperService.getPaperById(this.paperId).subscribe((data: any) => {
        this.paper = data;
      });
    }
  }

  // Handle Payment & Registration
  onRegister() {
    if (!this.regForm.fullName || !this.regForm.organization) {
      alert("Please fill in all required fields.");
      return;
    }

    this.isLoading = true;

    // 1. Prepare Registration Object
    const newRegistration = {
      paperId: this.paperId,
      userEmail: this.currentUser.email,
      amount: this.registrationFee,
      details: this.regForm
      // id, date, status will be handled by Service
    };

    // 2. Call ConferenceService to save registration
    this.conferenceService.createRegistration(newRegistration).subscribe(() => {

      // 3. Update Paper Status to 'Registered' via PaperService
      if (this.paper) {
        this.paper.status = 'Registered';
        this.paperService.updatePaper(this.paper).subscribe(() => {

          this.isLoading = false;
          alert("✅ Payment Successful! You are officially registered.");
          this.router.navigate(['/dashboard/my-submissions']); // Go back

        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard/my-submissions']);
  }
}
