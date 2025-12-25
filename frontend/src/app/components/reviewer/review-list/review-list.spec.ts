import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ReviewList } from './review-list';
import { PaperService } from '../../../services/paper.service';
import { AuthService } from '../../../services/auth.service';

describe('ReviewList', () => {
  let component: ReviewList;
  let fixture: ComponentFixture<ReviewList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReviewList,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getCurrentUser: () => ({ user_id: 1 })   // fake logged-in user
          }
        },
        {
          provide: PaperService,
          useValue: {
            getAllPapers: () => of([])               // fake backend call
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

