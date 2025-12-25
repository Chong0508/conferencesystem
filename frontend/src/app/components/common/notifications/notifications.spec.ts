import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, BehaviorSubject } from 'rxjs';

import { Notifications } from './notifications';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';

describe('Notifications', () => {
  let component: Notifications;
  let fixture: ComponentFixture<Notifications>;
  let mockNotificationService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockNotificationService = {
      unreadCount$: new BehaviorSubject<number>(0),
      getNotifications: jasmine.createSpy().and.returnValue(of([])),
      markAsRead: jasmine.createSpy().and.returnValue(of(null)),
      markAllAsRead: jasmine.createSpy()
    };

    mockAuthService = {
      getLoggedUser: jasmine.createSpy().and.returnValue({ id: 1, role: 'Author' })
    };

    await TestBed.configureTestingModule({
      imports: [Notifications, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Notifications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load notifications on init', () => {
    expect(mockNotificationService.getNotifications).toHaveBeenCalled();
  });
});
