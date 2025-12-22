import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyReviewer } from './apply-reviewer';

describe('ApplyReviewer', () => {
  let component: ApplyReviewer;
  let fixture: ComponentFixture<ApplyReviewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyReviewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyReviewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
