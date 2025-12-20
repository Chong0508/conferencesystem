import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaperService } from '../../../services/paper.service';
import { AuthService } from '../../../services/auth.service';
import { TrackService } from '../../../services/track.service';

@Component({
  selector: 'app-submit-paper',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './submit-paper.html',
  styleUrl: './submit-paper.css'
})
export class SubmitPaper implements OnInit {

  tracks: any[] = [];
  paperObj: any = {
    title: '',
    abstract: '',
    trackId: '',
    keywords: '',
    fileName: ''
  };

  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private paperService: PaperService,
    private trackService: TrackService
  ) {}

  ngOnInit() {
    this.loadTracks();
  }

  loadTracks() {
    this.trackService.getAllTracks().subscribe({
      next: (data: any[]) => {
        this.tracks = data || [];
      },
      error: (err: any) => console.error('Failed to load tracks', err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File is too large! Max size is 10MB.');
        return;
      }
      this.paperObj.fileName = file.name;
    }
  }

  onSubmit() {
    if (!this.paperObj.title || !this.paperObj.abstract || !this.paperObj.trackId || !this.paperObj.fileName) {
      alert('Please fill in all required fields (*) and upload a file.');
      return;
    }

    const user = this.authService.getCurrentUser?.() ?? null;
    if (!user) {
      alert('Session expired. Please login again.');
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;

    const payload = {
      ...this.paperObj,
      authorId: user.user_id ?? user.id,
      status: 'Pending Review'
    };

    this.paperService.submitPaper(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        alert('🎉 Paper Submitted Successfully!');
        this.router.navigate(['/dashboard/my-submissions']);
      },
      error: (err: any) => {
        console.error('Submission error', err);
        this.isLoading = false;
        alert('Submission failed. Check backend connection.');
      }
    });
  }

  resetForm() {
    this.paperObj = { title: '', abstract: '', trackId: '', keywords: '', fileName: '' };
  }
}
