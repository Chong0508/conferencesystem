import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService { // 👈 Renamed class to UserService (Correct)

  private storageKey = 'mock_db_users';

  constructor() { }

  // --- 1. Get All Users (For User Management) ---
  getAllUsers(): Observable<any[]> {
    const data = localStorage.getItem(this.storageKey);
    const users = data ? JSON.parse(data) : [];
    return of(users).pipe(delay(300));
  }

  // --- 2. Get User by Email (For Profile) ---
  getUserByEmail(email: string): Observable<any> {
    const users = this.getUsersSync();
    const user = users.find((u: any) => u.email === email);
    return of(user).pipe(delay(300));
  }

  // --- 3. Update User (Edit Profile) ---
  updateUser(updatedUser: any): Observable<any> {
    const users = this.getUsersSync();
    const index = users.findIndex((u: any) => u.email === updatedUser.email);

    if (index !== -1) {
      users[index] = updatedUser;

      // Also update the currently logged-in user in session if it's the same person
      const currentUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
      if (currentUser.email === updatedUser.email) {
        localStorage.setItem('loggedUser', JSON.stringify(updatedUser));
      }

      this.saveToStorage(users);
      return of(updatedUser).pipe(delay(500));
    }
    return of(null);
  }

  // --- 4. Delete User (Admin) ---
  deleteUser(email: string): Observable<any> {
    let users = this.getUsersSync();
    users = users.filter((u: any) => u.email !== email);
    this.saveToStorage(users);
    return of({ success: true });
  }

  // --- Internal Helpers ---
  private getUsersSync(): any[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(data: any[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}
