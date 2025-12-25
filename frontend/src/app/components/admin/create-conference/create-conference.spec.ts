import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CreateConference } from './create-conference';

describe('CreateConference', () => {
  let component: CreateConference;
  let fixture: ComponentFixture<CreateConference>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateConference,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateConference);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

