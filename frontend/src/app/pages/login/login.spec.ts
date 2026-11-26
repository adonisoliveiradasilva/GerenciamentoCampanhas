import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { Login } from './login';
import { IAuthResponse, UserService } from '../../domains/user/services/user.service';
import { ToastService } from '../../domains/toast/services/toast-service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    localStorage.removeItem('auth_token');

    userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['login', 'refreshUserState']);
    toastServiceSpy = jasmine.createSpyObj<ToastService>('ToastService', ['show', 'remove']);

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: UserService, useValue: userServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate').and.resolveTo(true);

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('auth_token');
  });

  it('should create with initial empty credentials', () => {
    expect(component).toBeTruthy();
    expect(component.email()).toBe('');
    expect(component.password()).toBe('');
    expect(component.isLoading()).toBeFalse();
  });

  it('should warn and skip login when email and password are empty', () => {
    component.handleLoginSubmit();

    expect(toastServiceSpy.show).toHaveBeenCalledWith('warning', 'Por favor, preencha e-mail e senha.');
    expect(userServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should warn and skip login when password is missing', () => {
    component.email.set('admin@igreja.com');
    component.password.set('');

    component.handleLoginSubmit();

    expect(toastServiceSpy.show).toHaveBeenCalledWith('warning', 'Por favor, preencha e-mail e senha.');
    expect(userServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should warn and skip login when email is missing', () => {
    component.email.set('');
    component.password.set('Senha@123');

    component.handleLoginSubmit();

    expect(toastServiceSpy.show).toHaveBeenCalledWith('warning', 'Por favor, preencha e-mail e senha.');
    expect(userServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should authenticate, persist token, refresh user state and navigate to dashboard', () => {
    userServiceSpy.login.and.returnValue(of({ token: 'jwt-token-123' }));
    component.email.set('admin@igreja.com');
    component.password.set('Senha@123');

    component.handleLoginSubmit();

    expect(userServiceSpy.login).toHaveBeenCalledWith({
      email: 'admin@igreja.com',
      senha: 'Senha@123'
    });
    expect(localStorage.getItem('auth_token')).toBe('jwt-token-123');
    expect(userServiceSpy.refreshUserState).toHaveBeenCalledTimes(1);
    expect(component.isLoading()).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should display loading state while authentication request is pending', () => {
    const pending$ = new Subject<IAuthResponse>();
    userServiceSpy.login.and.returnValue(pending$.asObservable());

    component.email.set('admin@igreja.com');
    component.password.set('Senha@123');
    component.handleLoginSubmit();
    fixture.detectChanges();

    expect(component.isLoading()).toBeTrue();
    expect(fixture.nativeElement.querySelector('lumen-loading')).not.toBeNull();

    pending$.next({ token: 'tok' });
    pending$.complete();
    fixture.detectChanges();

    expect(component.isLoading()).toBeFalse();
    expect(fixture.nativeElement.querySelector('lumen-loading')).toBeNull();
  });

  it('should show API error message when login fails', () => {
    const errorResponse = new HttpErrorResponse({
      error: { erro: 'Usuário ou senha inválidos.' },
      status: 401
    });
    userServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.email.set('admin@igreja.com');
    component.password.set('errada');
    component.handleLoginSubmit();

    expect(component.isLoading()).toBeFalse();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Usuário ou senha inválidos.');
  });

  it('should show fallback error message when login error has no custom message', () => {
    const errorResponse = new HttpErrorResponse({ status: 500 });
    userServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.email.set('admin@igreja.com');
    component.password.set('Senha@123');
    component.handleLoginSubmit();

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Ocorreu um erro ao fazer login.');
  });

  it('should render link to forgot password page', () => {
    const linkEl = fixture.nativeElement.querySelector('a.lumen-link') as HTMLAnchorElement | null;
    expect(linkEl).not.toBeNull();
    expect(linkEl?.textContent).toContain('Esqueceu a senha?');
  });
});
