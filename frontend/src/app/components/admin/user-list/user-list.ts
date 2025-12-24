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
        // FIX 1: Handle null/undefined data
        if (!data || data.length === 0) {
          this.users = [];
          this.filteredUsers = [];
          this.isLoading = false;
          console.log('No users found');
          return;
        }

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
        console.log('Users loaded:', this.users);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.errorMessage = 'Failed to load users. Check console for details.';
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
    // FIX 2: Trim search term to prevent spaces-only searches
    const term = (this.searchTerm || '').toLowerCase().trim();

    this.filteredUsers = this.users.filter(user => {
      // Concatenate full name for search
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      const email = (user.email || '').toLowerCase();

      const matchesSearch = term === '' || fullName.includes(term) || email.includes(term);
      const matchesRole = this.selectedRole === 'All' || user.role === this.selectedRole;

      return matchesSearch && matchesRole;
    });

    console.log(`Filtered: ${this.filteredUsers.length} users (role: ${this.selectedRole}, search: "${term}")`);
  }

  // --- Delete User ---
  deleteUser(user: User) {
    // Security check: Prevent deletion of SuperAdmins
    if (user.role && (user.role.toLowerCase() === 'super admin' || user.role.toLowerCase() === 'superadmin')) {
      alert('⛔ Access Denied: SuperAdmin accounts cannot be deleted for security reasons.');
      return;
    }

    const userId = user.id;

    // FIX 3: Validate user ID exists
    if (!userId) {
      alert('⚠️ Error: User ID not found.');
      console.error('User object:', user);
      return;
    }

    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          alert('User deleted successfully.');
          this.loadUsers();

        },
        error: (err) => {
          console.error('❌ Delete failed:', err);
          alert('❌ Could not delete user: ' + (err.error?.message || 'Server error. Check console.'));
        }
      });
    }
  }

  // FIX 5: Optional - Add role validation method
  isValidRole(role: string): boolean {
    const validRoles = ['Author', 'Reviewer', 'Admin', 'Super Admin'];
    return validRoles.includes(role);
  }
}
