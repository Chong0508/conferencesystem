import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule], // Added CommonModule for *ngIf
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing implements OnInit {

  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Check if user is logged in to toggle "Login" / "Dashboard" buttons
    this.isLoggedIn = !!this.authService.getLoggedUser();
  }
}
