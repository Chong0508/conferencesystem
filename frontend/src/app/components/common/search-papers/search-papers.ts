import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaperService } from '../../../services/paper.service';

@Component({
  selector: 'app-search-papers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-papers.html',
  styleUrl: './search-papers.css'
})
export class SearchPapers implements OnInit {
  allRegisteredPapers: any[] = [];
  filteredPapers: any[] = [];
  searchQuery: string = '';
  isLoading: boolean = true;

  constructor(private paperService: PaperService) {}

  ngOnInit() {
    this.loadRegisteredPapers();
  }

  loadRegisteredPapers() {
    this.isLoading = true;
    this.paperService.getAllPapers().subscribe({
      next: (data) => {
        // Only show papers that have been PAID and REGISTERED
        this.allRegisteredPapers = data.filter(p => p.status === 'Registered');
        this.filteredPapers = this.allRegisteredPapers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Search Load Error:', err);
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredPapers = this.allRegisteredPapers;
      return;
    }

    this.filteredPapers = this.allRegisteredPapers.filter(p => 
      p.title.toLowerCase().includes(query) || 
      (p.submitterName && p.submitterName.toLowerCase().includes(query)) ||
      (p.keywords && p.keywords.some((k: string) => k.toLowerCase().includes(query)))
    );
  }

  viewManuscript(fileName: string) {
    const url = `http://localhost:8080/api/papers/download/${fileName}`;
    window.open(url, '_blank');
  }
}