import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
  conferences: any[] = []; 
  
  paperObj: any = {
    title: '',
    abstract: '',
    trackId: '',
    conferenceId: '', 
    keywords: '',
    fileName: ''
  };

  isLoading: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadTracks();
    this.loadConferences();

    this.route.queryParams.subscribe(params => {
      // Auto-select conference if the user clicked 'Submit' from a specific conference page
      if (params['confId']) {
        this.paperObj.conferenceId = Number(params['confId']);
      }

      if (params['edit']) {
        this.isEditMode = true;
        this.editPaperId = params['edit'];
        this.loadPaperData(params['edit']);
      }
    });
  }

  loadTracks() {
    this.http.get<any[]>('http://localhost:8080/api/tracks').subscribe(res => this.tracks = res);
  }

  loadConferences() {
    this.http.get<any[]>('http://localhost:8080/api/conferences').subscribe(res => this.conferences = res);
  }

  loadPaperData(id: number) {
    this.http.get<any>(`http://localhost:8080/api/papers/${id}`).subscribe(res => { 
      this.paperObj = {
        title: res.title,
        abstract: res.abstractText,
        trackId: res.trackId,
        conferenceId: res.conferenceId,
        keywords: res.keywords ? res.keywords.join(', ') : '',
        fileName: res.submissionFile 
      };
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file; 
      this.paperObj.fileName = file.name;
    }
  }

  onSubmit() {
    const user = this.authService.getCurrentUser();
    const finalUserId = user?.userId || user?.user_id || user?.id;

    if (!this.paperObj.conferenceId) {
      alert("Please select a conference to participate in.");
      return;
    }

    const paperData = {
      paperId: this.editPaperId,
      conferenceId: Number(this.paperObj.conferenceId), 
      trackId: Number(this.paperObj.trackId),
      title: this.paperObj.title,
      abstract: this.paperObj.abstract,
      authorId: Number(finalUserId),
      keywords: this.paperObj.keywords ? this.paperObj.keywords.split(',').map((k: any) => k.trim()) : [],
      status: 'Pending Review' 
    };

    const formData = new FormData();
    formData.append('paperData', new Blob([JSON.stringify(paperData)], { type: 'application/json' }));
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    } else if (!this.isEditMode) {
      alert('Please upload your manuscript.');
      return;
    }

    this.isLoading = true;
    const request = this.isEditMode 
      ? this.http.put(`http://localhost:8080/api/papers/${this.editPaperId}`, formData)
      : this.http.post('http://localhost:8080/api/papers', formData);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        alert('Paper submitted successfully for review!');
        this.router.navigate(['/dashboard/my-submissions']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Submission Error:', err);
      }
    });
  }

  resetForm() {
    this.paperObj = { title: '', abstract: '', trackId: '', conferenceId: '', keywords: '', fileName: '' };
    this.selectedFile = null;
  }
}