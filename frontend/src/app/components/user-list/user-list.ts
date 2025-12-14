import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 定义 Interface 匹配 Register 的数据结构
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

  // 必须和 AuthService 里的 key 一样
  private storageKey = 'mock_db_users';

  constructor() { }

  ngOnInit(): void {
    this.loadUsersFromLocalStorage();
  }

  // --- 读取真实数据 ---
  loadUsersFromLocalStorage() {
    const storedUsers = localStorage.getItem(this.storageKey);

    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
      this.filteredUsers = [...this.users];
    } else {
      console.log('No registered users found.');
      this.users = [];
      this.filteredUsers = [];
    }
  }

  // --- 搜索 ---
  searchUsers() {
    this.applyFilters();
  }

  // --- 筛选 ---
  filterByRole() {
    this.applyFilters();
  }

  // --- 核心筛选逻辑 ---
  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const term = this.searchTerm.toLowerCase();

      // 拼接全名进行搜索
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      const email = (user.email || '').toLowerCase();

      const matchesSearch = fullName.includes(term) || email.includes(term);
      const matchesRole = this.selectedRole === 'All' || user.role === this.selectedRole;

      return matchesSearch && matchesRole;
    });
  }

  // --- 删除用户 ---
  deleteUser(email: string) {
    if (confirm(`Are you sure you want to delete user: ${email}?`)) {
      // 1. 从内存移除
      this.users = this.users.filter(u => u.email !== email);

      // 2. 更新 Local Storage (永久删除)
      localStorage.setItem(this.storageKey, JSON.stringify(this.users));

      // 3. 刷新页面
      this.applyFilters();
    }
  }

  // (可选) 这是一个方便调试的函数，如果你想清空所有用户
  clearAllUsers() {
    if(confirm('Warning: This will delete ALL users. Continue?')) {
      localStorage.removeItem(this.storageKey);
      this.users = [];
      this.filteredUsers = [];
    }
  }
}
