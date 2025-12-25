import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ReviewHistory } from './review-history';
import { ReviewService } from '../../../services/review.service';
import { PaperService } from '../../../services/paper.service';

describe('ReviewHistory', () => {
  let component: ReviewHistory;
  let fixture: ComponentFixture<ReviewHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewHistory, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: ReviewService, useValue: { getReviewsByReviewer: () => of([]) } },
        { provide: PaperService, useValue: { getAllPapers: () => of([]) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

