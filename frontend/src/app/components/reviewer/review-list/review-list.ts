import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaperService } from '../../../services/paper.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-list.html',
  styleUrl: './review-list.css'
})
export class ReviewList implements OnInit {

  papers: any[] = [];
  isLoading: boolean = true;
  currentUser: any;

  constructor(private paperService: PaperService, private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadPapers();
  }

  loadPapers() {
    this.isLoading = true;
    const currentUserId = this.currentUser?.user_id || this.currentUser?.userId || this.currentUser?.id;

    if (!currentUserId) {
      console.error('User ID not found');
      this.isLoading = false;
      return;
    }

    this.paperService.getAllPapers().subscribe({
      next: (data) => {
        // Papers for review: Pending Review status, NOT submitted by reviewer
        this.papers = (data || []).filter(p =>
          p.status === 'Pending Review' &&
          Number(p.submittedBy) !== Number(currentUserId)
        );
        console.log('Papers for review:', this.papers);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading papers:', err);
        this.isLoading = false;
      }
    });
  }

  onGrade(paperId: number) {
    console.log('Opening grade for paper:', paperId);
    this.router.navigate(['/dashboard/review', paperId]);
  }
}
