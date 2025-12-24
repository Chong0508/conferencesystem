import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackService, Track } from '../../../services/track.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-manage-tracks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-tracks.html',
  styleUrl: './manage-tracks.css'
})
export class ManageTracks implements OnInit {

  tracks: any[] = [];
  currentUserId: number | null = null;

  newTrackName: string = '';
  newTrackDescription: string = '';

  editingTrack: any = null;

  constructor(
    private trackService: TrackService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadCurrentUser();
    this.loadTracks();
  }

  loadCurrentUser() {
    const userStr = localStorage.getItem('loggedUser') || localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserId = user.id || user.user_id || user.userId;
    }
  }

  loadTracks() {
      this.trackService.getAllTracks().subscribe({
        next: (data) => {
          console.log('✅ Tracks from Backend:', data);
          this.processBackendData(data);
        },
        error: (err) => {
          console.error('❌ Error fetching tracks:', err);
          this.tracks = [];
        }
      });
    }

    processBackendData(data: Track[]) {
      this.tracks = data.map(item => ({
        id: item.track_id,
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

          // 3. TRIGGER NOTIFICATION
          if (this.currentUserId) {
            this.notificationService.createNotification(
              this.currentUserId,
              `Track "${this.newTrackName}" added successfully.`,
              'success'
            );
          }

          alert('✅ Track added successfully!');
          this.newTrackName = '';
          this.newTrackDescription = '';
          this.loadTracks();
        },

        error: (err: any) => {
            console.error('Backend Error Details:', err);
            alert('Failed to add track. Check console for errors.');
          }
      });
    }

  deleteTrack(id: number) {
      if (confirm("Are you sure you want to delete this track?")) {
        this.trackService.deleteTrack(id).subscribe({
          next: () => {
            console.log('✅ Track deleted');

            // 3. TRIGGER NOTIFICATION
            if (this.currentUserId) {
              this.notificationService.createNotification(
                this.currentUserId,
                `Track deleted successfully.`,
                'warning'
              );
            }

            alert('Track deleted successfully!');
            this.loadTracks();
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

          // 3. TRIGGER NOTIFICATION
          if (this.currentUserId) {
            this.notificationService.createNotification(
              this.currentUserId,
              `Track "${this.editingTrack.name}" updated successfully.`,
              'success'
            );
          }

          alert('Track updated successfully!');
          this.editingTrack = null;
          this.loadTracks();
        },
        error: (err) => {
          console.error('❌ Error updating track:', err);
          alert('Failed to update track.');
        }
      });
    }
}
