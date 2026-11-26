import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { ToastWrapper } from './components/organisms/toast-wrapper/toast-wrapper';
import { ConfirmationModal } from './components/molecules/confirmation-modal/confirmation-modal';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize title signal with "frontend"', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as unknown as { title: () => string };
    expect(app.title()).toBe('frontend');
  });

  it('should render router-outlet, toast wrapper, and confirmation modal', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('lumen-toast-wrapper')).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ToastWrapper))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ConfirmationModal))).toBeTruthy();
    expect(document.body.querySelector('lumen-confirmation-modal')).toBeTruthy();

    fixture.destroy();
    expect(document.body.querySelector('lumen-confirmation-modal')).toBeNull();
  });
});
