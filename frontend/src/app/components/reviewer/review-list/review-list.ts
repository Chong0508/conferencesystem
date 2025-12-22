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

      if (!this.currentUser) {
        console.error('User not logged in');
        this.isLoading = false;
        return;
      }

      this.paperService.getAllPapers().subscribe({
        next: (data) => {
          // Optional: filter papers assigned to this user
          // For example, only show papers not authored by current user
          this.papers = data.filter(p => p.authorId !== this.currentUser.user_id);
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
