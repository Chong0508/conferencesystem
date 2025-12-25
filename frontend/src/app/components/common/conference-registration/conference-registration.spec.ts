import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConferenceRegistration } from './conference-registration';

describe('ConferenceRegistration', () => {
  let component: ConferenceRegistration;
  let fixture: ComponentFixture<ConferenceRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceRegistration, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ConferenceRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

