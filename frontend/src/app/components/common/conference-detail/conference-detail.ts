import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConferenceService } from '../../../services/conference.service';
import { PaperService } from '../../../services/paper.service';

@Component({
  selector: 'app-conference-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './conference-detail.html',
  styleUrl: './conference-detail.css'
})
export class ConferenceDetail implements OnInit {
  conference: any = null;
  relatedPapers: any[] = [];
  isLoading: boolean = true;
  error: string = '';
  isConferenceClosed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private confService: ConferenceService,
    private paperService: PaperService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchDetails(Number(id));
    }
  }

  fetchDetails(id: number) {
    this.isLoading = true;
    this.confService.getConferenceById(id).subscribe({
      next: (data) => {
        this.conference = data;
        this.checkConferenceStatus(); // Malaysia Time Check
        this.loadConferencePapers(id);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Could not find conference details.";
        this.isLoading = false;
      }
    });
  }

  /**
   * Checks status based on Malaysia Time (UTC+8)
   */
  checkConferenceStatus() {
    if (!this.conference.start_date) return;

    // Get current time in Malaysia (UTC+8)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const malaysiaTime = new Date(utc + (3600000 * 8));

    // Assuming conference.start_date is in 'YYYY-MM-DD' format
    const confStartDate = new Date(this.conference.start_date);
    
    // If current Malaysia date is after the start date, we consider it "Closed" for submissions
    this.isConferenceClosed = malaysiaTime > confStartDate;
  }

  loadConferencePapers(confId: number) {
    this.paperService.getAllPapers().subscribe({
      next: (allPapers) => {
        this.relatedPapers = allPapers.filter((p: any) => 
          p.conferenceId === confId && (p.status === 'Registered' || p.status === 'Pending Review' || p.status === 'Accepted')
        );
      }
    });
  }
}