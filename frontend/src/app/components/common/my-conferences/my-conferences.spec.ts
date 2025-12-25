import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MyConferences } from './my-conferences';

describe('MyConferences', () => {
  let component: MyConferences;
  let fixture: ComponentFixture<MyConferences>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyConferences, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MyConferences);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
