import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTracks } from './manage-tracks';

describe('ManageTracks', () => {
  let component: ManageTracks;
  let fixture: ComponentFixture<ManageTracks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTracks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTracks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
