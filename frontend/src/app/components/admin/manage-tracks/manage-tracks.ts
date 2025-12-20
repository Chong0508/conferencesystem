import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TrackService, Track } from '../../../services/track.service';

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
  newTrackDescription: string = '';

  // Model for editing
  editingTrack: any = null;

  constructor(private trackService: TrackService) { }

  ngOnInit() {
    this.loadTracks();
  }

  loadTracks() {
      this.trackService.getAllTracks().subscribe({
        next: (data) => {
          console.log('✅ Tracks from Backend:', data);
          this.processBackendData(data);
        },
        error: (err) => {
          console.error('❌ Error fetching tracks:', err);
          // Fallback to empty array if backend fails
          this.tracks = [];
        }
      });
    }

    processBackendData(data: Track[]) {
      this.tracks = data.map(item => ({
        id: item.track_id, // Ensure this matches track.id used in HTML
        name: item.name || 'Unnamed Track',
        description: item.description || '',
        conference_id: item.conference_id,
        chair_id: item.chair_id
      }));
    }

  addTrack() {
      if (!this.newTrackName.trim()) return;

      const payload: Track = {
        name: this.newTrackName.trim(),
        description: this.newTrackDescription.trim() || 'No description provided',
        conference_id: 1,
        chair_id: 1
      };

      this.trackService.createTrack(payload).subscribe({
        next: (savedTrack) => {
          console.log('✅ Track created:', savedTrack);
          alert('✅ Track added successfully!');
          this.newTrackName = '';
          this.newTrackDescription = '';
          this.loadTracks();
        },

        error: (err: any) => { // Fixed typo from 'eerror' to 'error'
            console.error('Backend Error Details:', err); // This tells you WHY it failed
            alert('Failed to add track. Check console for errors.');
          }
      });
    }

  deleteTrack(id: number) {
      if (confirm("Are you sure you want to delete this track? Authors won't be able to select it anymore.")) {
        this.trackService.deleteTrack(id).subscribe({
          next: () => {
            console.log('✅ Track deleted');
            alert('Track deleted successfully!');
            this.loadTracks(); // Reload from backend
          },
          error: (err) => {
            console.error('❌ Error deleting track:', err);
            alert('Failed to delete track.');
          }
        });
      }
    }

    startEdit(track: any) {
      this.editingTrack = { ...track };
    }

    cancelEdit() {
      this.editingTrack = null;
    }

  saveEdit() {
      if (!this.editingTrack.name.trim()) {
        alert('Track name cannot be empty!');
        return;
      }

      const payload: Track = {
        track_id: this.editingTrack.id,
        name: this.editingTrack.name.trim(),
        description: this.editingTrack.description || '',
        conference_id: this.editingTrack.conference_id || 1,
        chair_id: this.editingTrack.chair_id || 1
      };

      this.trackService.updateTrack(this.editingTrack.id, payload).subscribe({
        next: (updatedTrack) => {
          console.log('✅ Track updated:', updatedTrack);
          alert('Track updated successfully!');
          this.editingTrack = null;
          this.loadTracks(); // Reload from backend
        },
        error: (err) => {
          console.error('❌ Error updating track:', err);
          alert('Failed to update track.');
        }
      });
    }
}
