import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user from localStorage', () => {
    localStorage.setItem('loggedUser', JSON.stringify({ role: 'Admin' }));
    component.loadUser();
    expect(component.loggedUser.role).toBe('Admin');
  });

  it('should clear localStorage on logout', () => {
    localStorage.setItem('loggedUser', JSON.stringify({ role: 'Admin' }));
    component.onLogout();
    expect(localStorage.getItem('loggedUser')).toBeNull();
  });
});
