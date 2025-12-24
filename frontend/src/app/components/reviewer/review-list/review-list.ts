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

  constructor(private paperService: PaperService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
     this.loadPapers();
}

loadPapers() {
  this.isLoading = true;

  // 1. Check for the user ID using multiple common keys
  const currentUserId = this.currentUser?.user_id || this.currentUser?.userId || this.currentUser?.id;

  if (!currentUserId) {
    console.error('User ID not found in localStorage');
    this.isLoading = false;
    return;
  }

  this.paperService.getAllPapers().subscribe({
    next: (data) => {
      // 2. Filter logic using the verified currentUserId
      this.papers = data.filter(p => {
        // Must be 'Pending Review'
        const isPending = p.status === 'Pending Review';
        
        // Must NOT be the current user (using Number() to ensure type match)
        const isNotMine = Number(p.authorId) !== Number(currentUserId);
        
        return isPending && isNotMine;
      });
      
      this.isLoading = false;
    },
    error: (err) => {
      console.error("Fetch error:", err);
      this.isLoading = false;
    }
  });
}

    onGrade(paperId: number) {
      if (!paperId) {
        console.error("Navigation failed: Paper ID is missing!");
        return;
      }
      // This must match the path in your App Routing module (e.g., /dashboard/review/:id)
      this.router.navigate(['/dashboard/review', paperId]);
    }
  }
