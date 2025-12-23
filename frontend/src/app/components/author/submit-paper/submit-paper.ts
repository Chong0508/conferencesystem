import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
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
  isEditMode: boolean = false;
  editPaperId: number | null = null;
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
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private paperService: PaperService,
    private trackService: TrackService
  ) {}

  ngOnInit() {
    this.loadTracks();

    // Check for "edit" query parameter
    this.route.queryParams.subscribe(params => {
      if (params['edit']) {
        this.isEditMode = true;
        this.editPaperId = params['edit'];
        this.loadPaperData(params['edit']);
      }
    });
  }

  loadTracks() {
    this.http.get<any[]>('http://localhost:8080/api/tracks').subscribe(res => {
      this.tracks = res;
    });
  }

  loadPaperData(id: number) {
    this.http.get<any>(`http://localhost:8080/api/papers/${id}`).subscribe(res => { 
      this.paperObj = {
        title: res.title,
        abstract: res.abstractText,
        trackId: res.trackId,
        keywords: res.keywords ? res.keywords.join(', ') : '',
        // REFINEMENT: This is the name from the DB that persists after logout
        fileName: res.submissionFile 
      };
    });
  }

  getManuscriptUrl(fileNameFromDB: string | undefined): string {
  if (!fileNameFromDB) return '#';
  
  // No complex string splitting needed because we refined the DB to only store the name
  return `http://localhost:8080/api/papers/download/${fileNameFromDB}`;
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
    const user = this.authService.getCurrentUser();
    const finalUserId = user?.userId || user?.user_id || user?.id;

    const paperData = {
      paperId: this.editPaperId, // Include ID if editing
      trackId: Number(this.paperObj.trackId),
      title: this.paperObj.title,
      abstract: this.paperObj.abstract,
      authorId: Number(finalUserId),
      keywords: this.paperObj.keywords ? this.paperObj.keywords.split(',').map((k: any) => k.trim()) : [],
      status: 'Pending Review'
    };

    const formData = new FormData();
    formData.append('paperData', new Blob([JSON.stringify(paperData)], { type: 'application/json' }));
    
    // Only append file if a new one was selected
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    } else if (!this.isEditMode) {
      alert('Please select a file!');
      return;
    }

    this.isLoading = true;

    // Smart logic: If edit mode, use PUT. Otherwise, use POST.
    const request = this.isEditMode 
      ? this.http.put(`http://localhost:8080/api/papers/${this.editPaperId}`, formData)
      : this.http.post('http://localhost:8080/api/papers', formData);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        alert(this.isEditMode ? 'Paper updated successfully!' : 'Paper submitted successfully!');
        this.router.navigate(['/dashboard/my-submissions']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Operation failed:', err);
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
