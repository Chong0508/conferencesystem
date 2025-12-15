import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 👇 Import Services
import { AuthService } from '../../../services/auth';
import { UserService } from '../../../services/user';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile implements OnInit {

  user: any = {};
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getLoggedUser();
    if (currentUser) {
      this.user = { ...currentUser }; // Clone object
    }
  }

  onSave() {
    this.isLoading = true;
    this.userService.updateUser(this.user).subscribe(() => {
      this.isLoading = false;
      alert("✅ Profile updated successfully!");
      // Session update is handled implicitly or you can force refresh
    });
  }
}
