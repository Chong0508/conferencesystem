import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceRegistration } from './paper-payment';

describe('ConferenceRegistration', () => {
  let component: ConferenceRegistration;
  let fixture: ComponentFixture<ConferenceRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConferenceRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
