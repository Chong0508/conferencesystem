import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConferenceService } from '../../../services/conference';

@Component({
  selector: 'app-conference-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // Added CommonModule for *ngFor
  templateUrl: './conference-list.html',
  styleUrl: './conference-list.css',
})
export class ConferenceList implements OnInit {

  conferences: any[] = [];

  constructor(private conferenceService: ConferenceService) {}

  ngOnInit() {
    this.loadConferences();
  }

  loadConferences() {
    this.conferenceService.getAllConferences().subscribe(data => {
      this.conferences = data;
    });
  }
}
