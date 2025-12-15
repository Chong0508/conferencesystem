import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit {

  notifications: any[] = [];

  constructor() {}

  ngOnInit() {
    // Mock Data
    this.notifications = [
      { id: 1, title: 'Welcome', message: 'Welcome to the system!', time: 'Just now', read: false },
      { id: 2, title: 'System Update', message: 'Maintenance scheduled for Sunday.', time: '1 day ago', read: true }
    ];
  }

  markAsRead(id: number) {
    const notif = this.notifications.find(n => n.id === id);
    if(notif) notif.read = true;
  }
}
