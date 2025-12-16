// File: frontend/src/app/components/common/my-profile/my-profile.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css'
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


    console.log('Data dari AuthService:', currentUser);

    if (currentUser) {
      this.user = { ...currentUser };
    }
  }

  onSave() {
    this.isLoading = true;
    this.userService.updateUser(this.user).subscribe(() => {
      this.isLoading = false;
      alert("✅ Profile updated successfully!");
    });
  }
}
