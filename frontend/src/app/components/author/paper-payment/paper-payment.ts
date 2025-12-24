import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PaperService } from '../../../services/paper.service';

@Component({
  selector: 'app-paper-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paper-payment.html',
  styleUrl: './paper-payment.css'
})
export class PaperPayment implements OnInit {
  paperId: any;
  paper: any = null;
  currentUser: any = {};
  isLoading: boolean = false;
  publicationFee: number = 150;

  paymentForm: any = {
    fullName: '',
    organization: '',
    dietary: 'None',
    paymentMethod: 'Credit Card'
  };

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private http: HttpClient,
    private paperService: PaperService
  ) {}

  ngOnInit() {
    this.paperId = this.route.snapshot.paramMap.get('paperId');
    const localUser = localStorage.getItem('loggedUser');
    if (localUser) {
      this.currentUser = JSON.parse(localUser);
      this.paymentForm.fullName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    this.loadPaper();
  }

  loadPaper() {
    this.paperService.getPaperById(this.paperId).subscribe({
      next: (data) => { this.paper = data; },
      error: (err) => console.error("Error loading paper", err)
    });
  }

  onPay() {
    this.isLoading = true;
    const paymentPayload = {
      registration_id: Number(this.paperId),
      amount: this.publicationFee,
      currency: 'MYR'
    };

    this.http.post('http://localhost:8080/api/payments', paymentPayload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        alert(res.message); // "Payment processed successfully in KL Time"
        this.router.navigate(['/dashboard/my-submissions']);
      },
      error: (err) => {
        this.isLoading = false;
        alert("Error: " + err.error);
      }
    });
  }

  goBack() { this.router.navigate(['/dashboard/my-submissions']); }
}