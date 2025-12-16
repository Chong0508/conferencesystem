import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 👇 Import UserService
import { UserService } from '../../../services/user.service';

// Define Interface matching Register data structure
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

  // 👇 Inject UserService
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // --- Load Real Data ---
  loadUsers() {
    // 👇 Use Service to get users
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
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
  deleteUser(email: string) {
    if (confirm(`Are you sure you want to delete user: ${email}?`)) {
      // 👇 Use Service to delete user
      this.userService.deleteUser(email).subscribe(() => {
        this.loadUsers(); // Refresh list
      });
    }
  }

  // (Optional) Debug function to clear all users
  clearAllUsers() {
    if(confirm('Warning: This will delete ALL users. Continue?')) {
      // Assuming you might add this method to UserService later
      // this.userService.deleteAllUsers().subscribe(...)
      alert('Function not implemented in service yet.');
    }
  }
}
