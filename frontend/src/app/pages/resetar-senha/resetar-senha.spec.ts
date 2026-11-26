import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, provideRouter, Router } from '@angular/router';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';

import { ResetarSenha } from './resetar-senha';
import { ToastService } from '../../domains/toast/services/toast-service';
import { environment } from '../../../environments/environment';

describe('ResetarSenha', () => {
  let component: ResetarSenha;
  let fixture: ComponentFixture<ResetarSenha>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let queryParams$: BehaviorSubject<Params>;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  const expectedEndpoint = `${environment.apiUrl || 'http://localhost:5000/api'}/auth/reset-password`;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['post']);
    toastServiceSpy = jasmine.createSpyObj<ToastService>('ToastService', ['show', 'remove']);
    queryParams$ = new BehaviorSubject<Params>({
      email: 'gestor@igreja.com',
      token: 'reset-token-abc'
    });

    await TestBed.configureTestingModule({
      imports: [ResetarSenha],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { queryParams: queryParams$.asObservable() }
        },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate').and.resolveTo(true);

    fixture = TestBed.createComponent(ResetarSenha);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and read email and token from query params', () => {
    expect(component).toBeTruthy();
    expect(component.email()).toBe('gestor@igreja.com');
    expect(component.token()).toBe('reset-token-abc');
    expect(component.novaSenha()).toBe('');
    expect(component.isLoading()).toBeFalse();
  });

  it('should default email and token to empty strings when query params are absent', () => {
    queryParams$.next({});

    expect(component.email()).toBe('');
    expect(component.token()).toBe('');
  });

  it('should warn and skip request when novaSenha is empty', () => {
    component.novaSenha.set('');

    component.handleSubmit();

    expect(toastServiceSpy.show).toHaveBeenCalledWith('warning', 'Por favor, informe a nova senha.');
    expect(httpClientSpy.post).not.toHaveBeenCalled();
  });

  it('should submit reset-password payload, show success toast and navigate to login', () => {
    httpClientSpy.post.and.returnValue(of({}));
    component.novaSenha.set('NovaSenha@123');

    component.handleSubmit();

    expect(httpClientSpy.post).toHaveBeenCalledWith(expectedEndpoint, {
      email: 'gestor@igreja.com',
      token: 'reset-token-abc',
      novaSenha: 'NovaSenha@123'
    });
    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Senha alterada com sucesso!');
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should display loading state while reset request is pending', () => {
    const pending$ = new Subject<unknown>();
    httpClientSpy.post.and.returnValue(pending$.asObservable());
    component.novaSenha.set('NovaSenha@123');

    component.handleSubmit();
    fixture.detectChanges();

    expect(component.isLoading()).toBeTrue();
    expect(fixture.nativeElement.querySelector('lumen-loading')).not.toBeNull();

    pending$.next({});
    pending$.complete();
    fixture.detectChanges();

    expect(component.isLoading()).toBeFalse();
    expect(fixture.nativeElement.querySelector('lumen-loading')).toBeNull();
  });

  it('should show backend error message when reset fails', () => {
    const errorResponse = new HttpErrorResponse({
      error: { erro: 'Token expirado.' },
      status: 400
    });
    httpClientSpy.post.and.returnValue(throwError(() => errorResponse));
    component.novaSenha.set('NovaSenha@123');

    component.handleSubmit();

    expect(component.isLoading()).toBeFalse();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Token expirado.');
  });

  it('should show fallback error message when error response has no erro property', () => {
    const errorResponse = new HttpErrorResponse({ status: 500 });
    httpClientSpy.post.and.returnValue(throwError(() => errorResponse));
    component.novaSenha.set('NovaSenha@123');

    component.handleSubmit();

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Erro ao redefinir a senha.');
  });

  it('should trigger handleSubmit on form submit event', () => {
    const submitSpy = spyOn(component, 'handleSubmit');
    const formEl = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    formEl.dispatchEvent(new Event('submit'));

    expect(submitSpy).toHaveBeenCalledTimes(1);
  });
});
