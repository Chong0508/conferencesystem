import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Grading } from './grading';
import { ReviewService } from '../../../services/review.service';
import { PaperService } from '../../../services/paper.service';
import { NotificationService } from '../../../services/notification.service';

describe('Grading', () => {
  let component: Grading;
  let fixture: ComponentFixture<Grading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Grading, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ReviewService, useValue: { getReviewsByReviewer: () => of([]) } },
        { provide: PaperService, useValue: { getPaperById: () => of({}) } },
        { provide: NotificationService, useValue: { createNotification: () => {} } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' }}}}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Grading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
