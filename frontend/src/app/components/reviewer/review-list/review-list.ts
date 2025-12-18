import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadPapers();
  }

  loadPapers() {
    // Simulate fetching data from backend
    setTimeout(() => {
      // 1. Get all papers from LocalStorage
      const allPapers = JSON.parse(localStorage.getItem('mock_papers') || '[]');

      // 2. Filter: Show only papers that are "Pending Review"
      // In a real app, you would also filter by "assigned to this reviewer"
      this.papers = allPapers.filter((p: any) => p.status === 'Pending Review');

      this.isLoading = false;
    }, 500); // 0.5s delay for realism
  }

  // Action: Go to Grading Page
  onGrade(paperId: number) {

    this.router.navigate(['/dashboard/review', paperId]);
  }
}
