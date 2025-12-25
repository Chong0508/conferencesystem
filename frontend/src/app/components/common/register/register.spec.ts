import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Register } from './register';
import { AuthService } from '../../../services/auth';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [Register, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register service', () => {
    mockAuthService.register.and.returnValue(of({}));

    component.registerObj = {
      firstName: 'A',
      lastName: 'B',
      email: 'a@test.com',
      password: '12345678',
      confirmPassword: '12345678',
      affiliation: 'UUM',
      role: 'Author'
    };

    component.onRegister();
    expect(mockAuthService.register).toHaveBeenCalled();
  });
});

