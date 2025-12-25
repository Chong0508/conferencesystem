import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SearchPapers } from './search-papers';
import { PaperService } from '../../../services/paper.service';
import { ConferenceService } from '../../../services/conference.service';

describe('SearchPapers', () => {
  let component: SearchPapers;
  let fixture: ComponentFixture<SearchPapers>;

  const mockPaperService = {
    getAllPapers: () => of([])
  };

  const mockConferenceService = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPapers, HttpClientTestingModule],
      providers: [
        { provide: PaperService, useValue: mockPaperService },
        { provide: ConferenceService, useValue: mockConferenceService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPapers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
