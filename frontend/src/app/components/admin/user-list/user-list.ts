import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../../services/user.service';

interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  joinDate?: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  selectedRole: string = 'All';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // --- Load Real Data ---
  loadUsers() {
    this.userService.getAllUsers().subscribe(data => {
        this.users = data.map((u: any) => ({
          role: u.category || 'Author',

          id: u.user_id,
          firstName: u.first_name,
          lastName: u.last_name,
          email: u.email,
          joinDate: u.created_at
        }));
        this.filteredUsers = [...this.users];
      });
  }

  // --- Search ---
  searchUsers() {
    this.applyFilters();
  }

  // --- Filter ---
  filterByRole() {
    this.applyFilters();
  }

  // --- Core Filter Logic ---
  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const term = this.searchTerm.toLowerCase();

      // Concatenate full name for search
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      const email = (user.email || '').toLowerCase();

      const matchesSearch = fullName.includes(term) || email.includes(term);
      const matchesRole = this.selectedRole === 'All' || user.role === this.selectedRole;

      return matchesSearch && matchesRole;
    });
  }

  // --- Delete User ---
  deleteUser(user: any) {
    // Use the specific ID from your MySQL model (likely user_id)
    const userId = user.user_id || user.id;

    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          console.log('✅ Success:', response);
          alert('User deleted successfully.');
          this.loadUsers(); // Refresh the list from the backend
        },
        error: (err) => {
          console.error('❌ Delete failed:', err);
          alert('Could not delete user. Check console for details.');
        }
      });
    }
  }
  }

