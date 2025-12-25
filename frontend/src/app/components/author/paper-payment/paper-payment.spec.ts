import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PaperPayment } from './paper-payment';

describe('PaperPayment', () => {
  let component: PaperPayment;
  let fixture: ComponentFixture<PaperPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperPayment, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PaperPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

