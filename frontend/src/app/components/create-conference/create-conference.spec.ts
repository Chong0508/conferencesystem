import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConference } from './create-conference';

describe('CreateConference', () => {
  let component: CreateConference;
  let fixture: ComponentFixture<CreateConference>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateConference]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateConference);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
