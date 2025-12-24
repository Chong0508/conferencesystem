import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferencePayment } from './conference-payment';

describe('ConferencePayment', () => {
  let component: ConferencePayment;
  let fixture: ComponentFixture<ConferencePayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferencePayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConferencePayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
