import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  ngOnInit() {
    this.loadTracks();
  }

  loadTracks() {
    // 1. Try to get tracks from LocalStorage
    const storedTracks = localStorage.getItem('mock_tracks');

    if (storedTracks) {
      this.tracks = JSON.parse(storedTracks);
    } else {
      // 2. Initialize Default Tracks (First time run)
      this.tracks = [
        { id: 1, name: 'Artificial Intelligence (AI) & Machine Learning' },
        { id: 2, name: 'Software Engineering (SE) & Architecture' },
        { id: 3, name: 'Cybersecurity & Network Defense' },
        { id: 4, name: 'Internet of Things (IoT) & Smart Systems' },
        { id: 5, name: 'Data Science & Big Data Analytics' }
      ];
      this.saveTracks();
    }
  }

  saveTracks() {
    localStorage.setItem('mock_tracks', JSON.stringify(this.tracks));
  }

  // --- Actions ---

  addTrack() {
    if (!this.newTrackName.trim()) return;

    const newId = this.tracks.length > 0 ? Math.max(...this.tracks.map(t => t.id)) + 1 : 1;

    this.tracks.push({
      id: newId,
      name: this.newTrackName.trim()
    });

    this.saveTracks();
    this.newTrackName = ''; // Reset input
    alert("✅ Track added successfully!");
  }

  deleteTrack(id: number) {
    if (confirm("Are you sure you want to delete this track? Authors won't be able to select it anymore.")) {
      this.tracks = this.tracks.filter(t => t.id !== id);
      this.saveTracks();
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

    const index = this.tracks.findIndex(t => t.id === this.editingTrack.id);
    if (index !== -1) {
      this.tracks[index] = this.editingTrack;
      this.saveTracks();
    }

    this.editingTrack = null; // Exit edit mode
  }
}
