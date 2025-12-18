import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  registrationFee: number = 150; // Standard fee
  isLoading: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.paperId = this.route.snapshot.paramMap.get('paperId');

    // Load User Data
    const localUser = localStorage.getItem('loggedUser');
    if (localUser) {
      this.currentUser = JSON.parse(localUser);
      this.regForm.fullName = this.currentUser.firstName + ' ' + this.currentUser.lastName;
    }

    this.loadPaper();
  }

  loadPaper() {
    // Fetch paper to display details
    const allPapers = JSON.parse(localStorage.getItem('mock_papers') || '[]');
    this.paper = allPapers.find((p: any) => p.id == this.paperId);
  }

  // Handle Payment & Registration
  onRegister() {
    if (!this.regForm.fullName || !this.regForm.organization) {
      alert("Please fill in all required fields.");
      return;
    }

    this.isLoading = true;

    // Simulate Processing
    setTimeout(() => {
      // 1. Save Registration Record
      const newRegistration = {
        id: Date.now(),
        paperId: this.paperId,
        userEmail: this.currentUser.email,
        amount: this.registrationFee,
        details: this.regForm,
        date: new Date(),
        status: 'Confirmed'
      };

      const registrations = JSON.parse(localStorage.getItem('mock_registrations') || '[]');
      registrations.push(newRegistration);
      localStorage.setItem('mock_registrations', JSON.stringify(registrations));

      // 2. Update Paper Status to 'Registered' (Optional, for UI feedback)
      const allPapers = JSON.parse(localStorage.getItem('mock_papers') || '[]');
      const paperIndex = allPapers.findIndex((p: any) => p.id == this.paperId);
      if (paperIndex > -1) {
        allPapers[paperIndex].status = 'Registered'; // Update status
        localStorage.setItem('mock_papers', JSON.stringify(allPapers));
      }

      this.isLoading = false;
      alert("✅ Payment Successful! You are officially registered.");
      this.router.navigate(['/dashboard/my-submissions']); // Go back
    }, 2000);
  }

  goBack() {
    this.router.navigate(['/dashboard/my-submissions']);
  }
}
