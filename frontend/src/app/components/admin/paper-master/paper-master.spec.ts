import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PaperMaster } from './paper-master';

describe('PaperMaster', () => {
  let component: PaperMaster;
  let fixture: ComponentFixture<PaperMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperMaster, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PaperMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

