import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button } from './button';

describe('Button', () => {
  let fixture: ComponentFixture<Button>;
  let component: Button;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with default inputs', () => {
    expect(component).toBeTruthy();
    expect(component.text()).toBe('');
    expect(component.type()).toBe('primary');
    expect(component.disabled()).toBeFalse();
    expect(component.loading()).toBeFalse();
    expect(component.isLoading()).toBeFalse();
    expect(component.icon()).toBe('');
    expect(component.nativeType()).toBe('button');

    const buttonEl = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
    expect(buttonEl.type).toBe('button');
    expect(buttonEl.classList.contains('primary')).toBeTrue();
    expect(buttonEl.disabled).toBeFalse();
    expect(buttonEl.classList.contains('is-skeleton')).toBeFalse();
  });

  it('should render text and icon when provided', () => {
    fixture.componentRef.setInput('text', 'Salvar');
    fixture.componentRef.setInput('icon', 'fas fa-save');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('span')?.textContent?.trim()).toBe('Salvar');
    expect(el.querySelector('i')?.classList.contains('fas')).toBeTrue();
    expect(el.querySelector('i')?.classList.contains('fa-save')).toBeTrue();
  });

  it('should hide text span when type is "circle-icon"', () => {
    fixture.componentRef.setInput('type', 'circle-icon');
    fixture.componentRef.setInput('text', 'Oculto');
    fixture.componentRef.setInput('icon', 'fas fa-plus');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('span')).toBeNull();
    expect(el.querySelector('i')?.classList.contains('fas')).toBeTrue();
    expect(el.querySelector('i')?.classList.contains('fa-plus')).toBeTrue();
  });

  it('should add host class "is-login-width" only when type is "login"', () => {
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.classList.contains('is-login-width')).toBeFalse();

    fixture.componentRef.setInput('type', 'login');
    fixture.detectChanges();
    expect(hostEl.classList.contains('is-login-width')).toBeTrue();

    fixture.componentRef.setInput('type', 'danger');
    fixture.detectChanges();
    expect(hostEl.classList.contains('is-login-width')).toBeFalse();
    expect(hostEl.querySelector('button')?.classList.contains('danger')).toBeTrue();
  });

  it('should apply nativeType attribute', () => {
    fixture.componentRef.setInput('nativeType', 'submit');
    fixture.detectChanges();

    const buttonEl = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
    expect(buttonEl.getAttribute('type')).toBe('submit');
  });

  it('should emit onClick when clicked', () => {
    const emitSpy = spyOn(component.onClick, 'emit');
    const buttonEl = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;

    buttonEl.click();
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should disable button and not emit onClick when disabled is true', () => {
    const emitSpy = spyOn(component.onClick, 'emit');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const buttonEl = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
    expect(buttonEl.disabled).toBeTrue();

    buttonEl.click();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should disable button and apply is-skeleton class when isLoading is true', () => {
    const emitSpy = spyOn(component.onClick, 'emit');
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const buttonEl = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
    expect(buttonEl.disabled).toBeTrue();
    expect(buttonEl.classList.contains('is-skeleton')).toBeTrue();

    buttonEl.click();
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
