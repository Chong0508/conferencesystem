import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MySubmissions } from './my-submissions';

describe('MySubmissions', () => {
  let component: MySubmissions;
  let fixture: ComponentFixture<MySubmissions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySubmissions, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MySubmissions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

