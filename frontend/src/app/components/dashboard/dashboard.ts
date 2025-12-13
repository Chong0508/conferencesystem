import { Component, OnInit } from '@angular/core'; // 👈 Import OnInit
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
// 👇 Implement OnInit to run code when page opens
export class Dashboard implements OnInit {

  // Default value (Placeholder) in case no one is logged in
  loggedUser: any = {
    firstName: 'Guest',
    lastName: 'User',
    role: 'Visitor',
    avatarColor: 'cccccc'
  };

  constructor(private router: Router) {}

  // 👇 This runs automatically when Dashboard loads
  ngOnInit() {
    // 1. Try to get data from Local Storage
    const localData = localStorage.getItem('loggedUser');

    // 2. If data exists, replace the Guest placeholder
    if (localData != null) {
      this.loggedUser = JSON.parse(localData);
      console.log('Dashboard loaded user:', this.loggedUser);
    } else {
      // Optional: If not logged in, kick back to login page
      // this.router.navigateByUrl('/login');
    }
  }

  onLogout() {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      // Clear the saved data
      localStorage.removeItem('loggedUser');
      this.router.navigateByUrl('/login');
    }
  }
}
