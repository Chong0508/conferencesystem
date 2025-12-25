import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PaperService } from './paper.service';

describe('PaperService', () => {
  let service: PaperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(PaperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

