import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
  tracks: any[] = []; 
  searchQuery: string = '';
  isLoading: boolean = true;

  constructor(
    private paperService: PaperService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    
    // 1. Fetch Tracks (Using your Track model: track_id and name)
    this.http.get<any[]>('http://localhost:8080/api/tracks').subscribe({
      next: (trackData) => {
        this.tracks = trackData;
        
        // 2. Fetch Papers
        this.paperService.getAllPapers().subscribe({
          next: (paperData) => {
            this.allRegisteredPapers = paperData.filter(p => p.status === 'Registered');
            this.filteredPapers = this.allRegisteredPapers;
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  // Uses your model field: .name
  getTrackName(trackId: number): string {
    const track = this.tracks.find(t => t.track_id === trackId);
    return track ? track.name : 'General Track';
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredPapers = this.allRegisteredPapers;
      return;
    }

    this.filteredPapers = this.allRegisteredPapers.filter(p => 
      p.title.toLowerCase().includes(query) || 
      this.getTrackName(p.trackId).toLowerCase().includes(query) ||
      // Now searching by Author Name as well
      (p.submitterName && p.submitterName.toLowerCase().includes(query)) ||
      (p.keywords && p.keywords.some((k: string) => k.toLowerCase().includes(query)))
    );
  }

  viewManuscript(fileName: string) {
    const url = `http://localhost:8080/api/papers/download/${fileName}`;
    window.open(url, '_blank');
  }
}