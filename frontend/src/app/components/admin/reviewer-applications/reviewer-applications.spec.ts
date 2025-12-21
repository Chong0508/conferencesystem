import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerApplications } from './reviewer-applications';

describe('ReviewerApplications', () => {
  let component: ReviewerApplications;
  let fixture: ComponentFixture<ReviewerApplications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewerApplications]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewerApplications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
