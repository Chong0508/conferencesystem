import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConferenceDetail } from './conference-detail';

describe('ConferenceDetail', () => {
  let component: ConferenceDetail;
  let fixture: ComponentFixture<ConferenceDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceDetail, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ConferenceDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

