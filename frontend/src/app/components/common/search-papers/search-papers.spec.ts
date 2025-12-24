import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPapers } from './search-papers';

describe('SearchPapers', () => {
  let component: SearchPapers;
  let fixture: ComponentFixture<SearchPapers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPapers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPapers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
