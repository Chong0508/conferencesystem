import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Dashboard } from './dashboard';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    // Create mock services
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isLoggedIn', 'logout']);
    mockUserService = jasmine.createSpyObj('UserService', ['getAllUsers', 'getUserById']);

    await TestBed.configureTestingModule({
      imports: [Dashboard, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on init', () => {
    mockAuthService.getCurrentUser.and.returnValue({ user_id: 1, email: 'test@test.com' });
    component.ngOnInit();
    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
  });

  it('should check if user is logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    expect(mockAuthService.isLoggedIn()).toBe(true);
  });
});
