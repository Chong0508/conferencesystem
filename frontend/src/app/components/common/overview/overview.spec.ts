import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OverviewComponent } from './overview';

import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { PaperService } from '../../../services/paper.service';
import { ReviewService } from '../../../services/review.service';
import { ConferenceService } from '../../../services/conference.service';
import { LogActivityService } from '../../../services/log-activity.service';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  const mockAuth = { getLoggedUser: () => ({ id: 1, role: 'Admin' }) };
  const mockUserService = { getAllUsers: () => of([]) };
  const mockPaperService = { getAllPapers: () => of([]), getPapersByAuthor: () => of([]) };
  const mockReviewService = {};
  const mockConferenceService = { getAllConferences: () => of([]) };
  const mockLogService = { getRecentLogs: () => of([]) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuth },
        { provide: UserService, useValue: mockUserService },
        { provide: PaperService, useValue: mockPaperService },
        { provide: ReviewService, useValue: mockReviewService },
        { provide: ConferenceService, useValue: mockConferenceService },
        { provide: LogActivityService, useValue: mockLogService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

