import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaperService } from '../../../services/paper.service';

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

  constructor(private paperService: PaperService, private router: Router) {}

  ngOnInit() {
    this.loadPapers();
}

  loadPapers() {
    this.paperService.getAllPapers().subscribe({
      next: (data) => {
        console.log("Full data from backend:", data); // Check your console!
        this.papers = data; // Show everything for now
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
