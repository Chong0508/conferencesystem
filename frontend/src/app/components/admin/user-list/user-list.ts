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
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // --- Load Real Data from Backend ---
  loadUsers() {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (data: any[]) => {
        this.users = data.map((u: any) => ({
          // Ensure keys match exactly what your Java Entity/DTO returns
          id: u.user_id || u.id, 
          firstName: u.first_name || u.firstName, 
          lastName: u.last_name || u.lastName,
          email: u.email,
          // Check for 'category' or 'role' depending on your Java model
          role: u.category || u.role || 'Author', 
          joinDate: u.created_at || u.createdAt
        }));
        this.filteredUsers = [...this.users];
        this.isLoading = false;
        console.log('✅ Users processed:', this.users);
      },
      error: (err) => {
        console.error('❌ Error loading users:', err);
        this.errorMessage = 'Failed to load users. Is the backend running?';
        this.isLoading = false;
      }
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
  deleteUser(user: User) {
    // NEW SECURITY CHECK: Prevent deletion of SuperAdmins
    if (user.role === 'Super Admin') {
      alert('⛔ Access Denied: SuperAdmin accounts cannot be deleted for security reasons.');
      return;
    }

    const userId = user.id;

    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      this.userService.deleteUser(userId!).subscribe({
        next: (response) => {
          alert('User deleted successfully.');
          this.loadUsers(); 
        },
        error: (err) => {
          console.error('❌ Delete failed:', err);
          alert('Could not delete user. This may be due to active dependencies.');
        }
      });
    }
  }
}
