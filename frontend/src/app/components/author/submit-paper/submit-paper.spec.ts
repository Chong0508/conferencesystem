import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SubmitPaper } from './submit-paper';

describe('SubmitPaper', () => {
  let component: SubmitPaper;
  let fixture: ComponentFixture<SubmitPaper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitPaper, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitPaper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


