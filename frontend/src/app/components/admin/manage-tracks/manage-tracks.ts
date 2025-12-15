import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 👇 Import ConferenceService
import { ConferenceService } from '../../../services/conference';

@Component({
  selector: 'app-manage-tracks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-tracks.html',
  styleUrl: './manage-tracks.css'
})
export class ManageTracks implements OnInit {

  tracks: any[] = [];

  // Model for adding a new track
  newTrackName: string = '';

  // Model for editing
  editingTrack: any = null;

  // 👇 Inject Service
  constructor(private conferenceService: ConferenceService) {}

  ngOnInit() {
    this.loadTracks();
  }

  loadTracks() {
    // 👇 Use Service to get tracks
    this.conferenceService.getAllTracks().subscribe(data => {
      this.tracks = data;
    });
  }

  // --- Actions ---

  addTrack() {
    if (!this.newTrackName.trim()) return;

    // 👇 Use Service to add track
    this.conferenceService.addTrack(this.newTrackName).subscribe(() => {
      this.newTrackName = ''; // Reset input
      this.loadTracks(); // Refresh list
      alert("✅ Track added successfully!");
    });
  }

  deleteTrack(id: number) {
    if (confirm("Are you sure you want to delete this track? Authors won't be able to select it anymore.")) {
      // 👇 Use Service to delete track
      this.conferenceService.deleteTrack(id).subscribe(() => {
        this.loadTracks(); // Refresh list
      });
    }
  }

  startEdit(track: any) {
    // Create a copy to avoid auto-updating UI before saving
    this.editingTrack = { ...track };
  }

  cancelEdit() {
    this.editingTrack = null;
  }

  saveEdit() {
    if (!this.editingTrack.name.trim()) return;

    // 👇 Use Service to update track
    this.conferenceService.updateTrack(this.editingTrack).subscribe(() => {
      this.editingTrack = null; // Exit edit mode
      this.loadTracks(); // Refresh list
    });
  }
}
