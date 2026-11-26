import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { EsqueceuSenha } from './esqueceu-senha';
import { ToastService } from '../../domains/toast/services/toast-service';
import { environment } from '../../../environments/environment';

describe('EsqueceuSenha', () => {
  let component: EsqueceuSenha;
  let fixture: ComponentFixture<EsqueceuSenha>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  const expectedEndpoint = `${environment.apiUrl || 'http://localhost:5000/api'}/auth/forgot-password`;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['post']);
    toastServiceSpy = jasmine.createSpyObj<ToastService>('ToastService', ['show', 'remove']);

    await TestBed.configureTestingModule({
      imports: [EsqueceuSenha],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate').and.resolveTo(true);

    fixture = TestBed.createComponent(EsqueceuSenha);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with initial empty state', () => {
    expect(component).toBeTruthy();
    expect(component.email).toBe('');
    expect(component.isLoading()).toBeFalse();
  });

  it('should warn and not submit when email is empty', () => {
    component.email = '';

    component.handleSubmit();

    expect(toastServiceSpy.show).toHaveBeenCalledWith('warning', 'Por favor, informe seu e-mail.');
    expect(httpClientSpy.post).not.toHaveBeenCalled();
  });

  it('should send forgot-password request, notify success and navigate to login', () => {
    httpClientSpy.post.and.returnValue(of({}));
    component.email = 'gestor@igreja.com';

    component.handleSubmit();

    expect(httpClientSpy.post).toHaveBeenCalledWith(expectedEndpoint, {
      email: 'gestor@igreja.com'
    });
    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'success',
      'Instruções enviadas para o seu e-mail.'
    );
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should toggle loading indicator while request is in flight', () => {
    const pending$ = new Subject<unknown>();
    httpClientSpy.post.and.returnValue(pending$.asObservable());
    component.email = 'gestor@igreja.com';

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

  it('should show backend error message when request fails', () => {
    const errorResponse = new HttpErrorResponse({
      error: { erro: 'E-mail não encontrado.' },
      status: 404
    });
    httpClientSpy.post.and.returnValue(throwError(() => errorResponse));
    component.email = 'desconhecido@igreja.com';

    component.handleSubmit();

    expect(component.isLoading()).toBeFalse();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'E-mail não encontrado.');
  });

  it('should show fallback error message when error response has no custom message', () => {
    const errorResponse = new HttpErrorResponse({ status: 500 });
    httpClientSpy.post.and.returnValue(throwError(() => errorResponse));
    component.email = 'gestor@igreja.com';

    component.handleSubmit();

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'error',
      'Ocorreu ao solicitar a recuperação.'
    );
  });

  it('should trigger handleSubmit on form ngSubmit', () => {
    const submitSpy = spyOn(component, 'handleSubmit');
    const formEl = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    formEl.dispatchEvent(new Event('submit'));

    expect(submitSpy).toHaveBeenCalledTimes(1);
  });

  it('should render back to login link', () => {
    const linkEl = fixture.nativeElement.querySelector('a.lumen-link') as HTMLAnchorElement | null;
    expect(linkEl).not.toBeNull();
    expect(linkEl?.textContent).toContain('Voltar ao login');
  });
});
