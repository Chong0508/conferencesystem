import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
// 👇 Import ConferenceService
import { ConferenceService } from '../../../services/conference';

@Component({
  selector: 'app-conference-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
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
    // 👇 Fetch data from service
    // Note: Ensure getAllConferences() exists in ConferenceService
    this.conferenceService.getAllConferences().subscribe(data => {
      this.conferences = data;
    });
  }
}
