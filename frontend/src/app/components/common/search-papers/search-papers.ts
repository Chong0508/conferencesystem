import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PaperService } from '../../../services/paper.service';
import { ConferenceService } from '../../../services/conference.service';
import { forkJoin } from 'rxjs'; // Import forkJoin for cleaner code

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
  conferences: any[] = []; 
  searchQuery: string = '';
  isLoading: boolean = true;

  constructor(
    private paperService: PaperService,
    private confService: ConferenceService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    
    // Using forkJoin to fetch Tracks and Conferences in parallel before loading papers
    forkJoin({
      tracks: this.http.get<any[]>('http://localhost:8080/api/tracks'),
      conferences: this.http.get<any[]>('http://localhost:8080/api/conferences')
    }).subscribe({
      next: (results) => {
        this.tracks = results.tracks;
        this.conferences = results.conferences;

        // Now load the papers and process the names
        this.paperService.getAllPapers().subscribe({
          next: (paperData) => {
            this.allRegisteredPapers = paperData
              .filter(p => p.status === 'Registered')
              .map(p => {
                // UPDATE: Combine firstName and lastName if submitterName is not already formatted
                // This assumes your backend sends firstName/lastName within the paper's user object
                const fullName = (p.firstName && p.lastName) 
                  ? `${p.firstName} ${p.lastName}` 
                  : p.submitterName || 'Unknown Author';

                return {
                  ...p,
                  submitterName: fullName
                };
              });

            this.filteredPapers = this.allRegisteredPapers;
            this.isLoading = false;
          },
          error: () => this.isLoading = false
        });
      },
      error: () => this.isLoading = false
    });
  }

  getTrackName(trackId: number): string {
    const track = this.tracks.find(t => t.track_id === trackId);
    return track ? track.name : 'General Track';
  }

  getConferenceAcronym(confId: number): string {
    const conf = this.conferences.find(c => c.conference_id === confId);
    return conf ? conf.acronym : 'Archive';
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
      this.getConferenceAcronym(p.conferenceId).toLowerCase().includes(query) || 
      (p.submitterName && p.submitterName.toLowerCase().includes(query)) ||
      (p.keywords && p.keywords.some((k: string) => k.toLowerCase().includes(query)))
    );
  }

  viewManuscript(fileName: string) {
    const url = `http://localhost:8080/api/papers/download/${fileName}`;
    window.open(url, '_blank');
  }
}