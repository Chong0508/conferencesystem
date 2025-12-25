import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PaperDetails } from './paper-details';
import { PaperService } from '../../../services/paper.service';
import { ReviewService } from '../../../services/review.service';
import { ConferenceService } from '../../../services/conference.service';

describe('PaperDetails', () => {
  let component: PaperDetails;
  let fixture: ComponentFixture<PaperDetails>;

  const mockPaperService = { getPaperById: () => of({ conferenceId: 1 }) };
  const mockReviewService = { getReviewsByPaper: () => of([]) };
  const mockConferenceService = { getConferenceById: () => of({ title: 'Test Conf' }) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperDetails, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: PaperService, useValue: mockPaperService },
        { provide: ReviewService, useValue: mockReviewService },
        { provide: ConferenceService, useValue: mockConferenceService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaperDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

