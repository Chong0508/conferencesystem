import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  selectedKeywordIds: number[] = [];
  paperObj: any = {
    title: '',
    abstract: '',
    trackId: '',
    keywords: '',
    fileName: ''
  };

  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private paperService: PaperService,
    private trackService: TrackService
  ) {}

  ngOnInit() {
    this.loadTracks();
  }

  loadTracks() {
    this.http.get<any[]>('http://localhost:8080/api/tracks').subscribe(res => {
      this.tracks = res;
    });
  }

  // Add this variable to your class
selectedFile: File | null = null;

onFileSelected(event: any) {
  const file = event.target.files?.[0];
  if (file) {
    this.selectedFile = file; // Store the actual file object
    this.paperObj.fileName = file.name;
  }
}

onSubmit() {
  if (!this.selectedFile) {
    alert('Please select a file!');
    return;
  }

  const user = this.authService.getCurrentUser();
  // DEBUG: Check if user exists
  if (!user) {
    alert('You must be logged in to submit a paper.');
    return;
  }

  const finalUserId = user.userId || user.user_id || user.id;

  const paperData = {
    trackId: Number(this.paperObj.trackId),
    title: this.paperObj.title,
    abstract: this.paperObj.abstract, // Jackson will map this to abstractText via @JsonProperty
    authorId: Number(finalUserId),    // Jackson will map this to submittedBy via @JsonProperty
    keywords: this.paperObj.keywords ? this.paperObj.keywords.split(',').map((k: string) => k.trim()) : [],
    status: 'Pending Review',
    version: 1
  };

  const formData = new FormData();
  // Use a blob with explicit type
  formData.append('paperData', new Blob([JSON.stringify(paperData)], { type: 'application/json' }));
  formData.append('file', this.selectedFile);

  this.isLoading = true;

  this.http.post('http://localhost:8080/api/papers', formData).subscribe({
    next: (res) => {
      this.isLoading = false;
      alert('Paper submitted successfully!');
      this.router.navigate(['/dashboard/my-submissions']);
    },
    error: (err) => {
      this.isLoading = false;
      console.error('Full Error Object:', err); // Check this in Chrome DevTools
      alert('Submission failed! Check the server logs for DB constraint violations.');
    }
  });
}

getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || 'pdf';
}

  resetForm() {
    this.paperObj = { title: '', abstract: '', trackId: '', keywords: '', fileName: '' };
  }
}
