import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input';

describe('InputComponent', () => {
  let fixture: ComponentFixture<InputComponent>;
  let component: InputComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mode', 'form');
    fixture.detectChanges();
  });

  it('should create with required mode and default inputs', () => {
    expect(component).toBeTruthy();
    expect(component.mode()).toBe('form');
    expect(component.label()).toBe('');
    expect(component.type()).toBe('text');
    expect(component.size()).toBe('medium');
    expect(component.autocomplete()).toBe('off');
    expect(component.required()).toBeFalse();
    expect(component.hasError()).toBeFalse();
    expect(component.disabled()).toBeFalse();
    expect(component.isLoading()).toBeFalse();
    expect(component.value()).toBe('');
    expect(component.currentType()).toBe('text');

    const inputEl = (fixture.nativeElement as HTMLElement).querySelector('input.input-field') as HTMLInputElement;
    expect(inputEl).toBeTruthy();
    expect(inputEl.type).toBe('text');
    expect(inputEl.classList.contains('is-form')).toBeTrue();
    expect(inputEl.getAttribute('autocomplete')).toBe('off');
  });

  it('should render label, required indicator, placeholder, name, and autocomplete attributes', () => {
    fixture.componentRef.setInput('label', 'E-mail');
    fixture.componentRef.setInput('required', true);
    fixture.componentRef.setInput('placeholder', 'Digite seu e-mail');
    fixture.componentRef.setInput('name', 'email');
    fixture.componentRef.setInput('autocomplete', 'email');
    fixture.componentRef.setInput('type', 'email');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const labelEl = el.querySelector('.input-label');
    const inputEl = el.querySelector('input.input-field') as HTMLInputElement;

    expect(labelEl?.textContent).toContain('E-mail');
    expect(el.querySelector('.required-indicator')?.textContent?.trim()).toBe('*');
    expect(inputEl.placeholder).toBe('Digite seu e-mail');
    expect(inputEl.getAttribute('name')).toBe('email');
    expect(inputEl.getAttribute('autocomplete')).toBe('email');
    expect(inputEl.type).toBe('email');
  });

  it('should omit is-form class when mode is "login"', () => {
    fixture.componentRef.setInput('mode', 'login');
    fixture.detectChanges();

    const inputEl = (fixture.nativeElement as HTMLElement).querySelector('input.input-field');
    expect(inputEl?.classList.contains('is-form')).toBeFalse();
  });

  it('should render prefix icon and hide it when loading', () => {
    fixture.componentRef.setInput('icon', 'fa-solid fa-envelope');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.prefix-icon')).toBeTruthy();
    expect(el.querySelector('input.input-field')?.classList.contains('has-prefix-icon')).toBeTrue();

    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    expect(el.querySelector('.prefix-icon')).toBeNull();
  });

  it('should render textarea with size class when type is "textarea"', () => {
    fixture.componentRef.setInput('type', 'textarea');
    fixture.componentRef.setInput('size', 'large');
    fixture.componentRef.setInput('placeholder', 'Observações');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('input.input-field')).toBeNull();
    const textareaEl = el.querySelector('textarea.input-field') as HTMLTextAreaElement;
    expect(textareaEl).toBeTruthy();
    expect(textareaEl.classList.contains('large')).toBeTrue();
    expect(textareaEl.classList.contains('is-form')).toBeTrue();
    expect(textareaEl.placeholder).toBe('Observações');

    textareaEl.value = 'Texto de observação';
    textareaEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.value()).toBe('Texto de observação');
  });

  it('should apply type-specific CSS classes for date, time, and number', () => {
    const el = fixture.nativeElement as HTMLElement;

    fixture.componentRef.setInput('type', 'date');
    fixture.detectChanges();
    expect(el.querySelector('input.input-field')?.classList.contains('is-date')).toBeTrue();

    fixture.componentRef.setInput('type', 'time');
    fixture.detectChanges();
    expect(el.querySelector('input.input-field')?.classList.contains('is-time')).toBeTrue();

    fixture.componentRef.setInput('type', 'number');
    fixture.detectChanges();
    expect(el.querySelector('input.input-field')?.classList.contains('is-number')).toBeTrue();
  });

  it('should toggle password visibility when type is "password"', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const inputEl = el.querySelector('input.input-field') as HTMLInputElement;
    const toggleBtn = el.querySelector('.toggle-password-btn') as HTMLButtonElement;

    expect(toggleBtn).toBeTruthy();
    expect(inputEl.classList.contains('has-icon')).toBeTrue();
    expect(component.isPasswordVisible()).toBeFalse();
    expect(component.currentType()).toBe('password');
    expect(inputEl.type).toBe('password');
    expect(toggleBtn.querySelector('i')?.classList.contains('fa-eye')).toBeTrue();

    toggleBtn.click();
    fixture.detectChanges();

    expect(component.isPasswordVisible()).toBeTrue();
    expect(component.currentType()).toBe('text');
    expect(inputEl.type).toBe('text');
    expect(toggleBtn.querySelector('i')?.classList.contains('fa-eye-slash')).toBeTrue();

    toggleBtn.click();
    fixture.detectChanges();
    expect(component.isPasswordVisible()).toBeFalse();
    expect(inputEl.type).toBe('password');
  });

  it('should hide password toggle button when loading', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.toggle-password-btn')).toBeNull();
  });

  it('should update value model on input event and sync programmatic value updates', async () => {
    const inputEl = (fixture.nativeElement as HTMLElement).querySelector('input.input-field') as HTMLInputElement;

    inputEl.value = 'Campanha Verão';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.value()).toBe('Campanha Verão');

    fixture.componentRef.setInput('value', 'Campanha Inverno');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(inputEl.value).toBe('Campanha Inverno');
  });

  it('should disable input when disabled or isLoading is true and apply skeleton classes when loading', async () => {
    const el = fixture.nativeElement as HTMLElement;
    const inputEl = el.querySelector('input.input-field') as HTMLInputElement;

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(inputEl.disabled).toBeTrue();

    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(inputEl.disabled).toBeTrue();
    expect(el.querySelector('.input-label')?.classList.contains('is-skeleton')).toBeTrue();
    expect(el.querySelector('.input-wrapper')?.classList.contains('is-skeleton')).toBeTrue();
  });

  it('should render error state and message only when hasError and errorMessage are set', () => {
    const el = fixture.nativeElement as HTMLElement;

    fixture.componentRef.setInput('hasError', true);
    fixture.detectChanges();
    expect(el.querySelector('input.input-field')?.classList.contains('error')).toBeTrue();
    expect(el.querySelector('.input-error-msg')).toBeNull();

    fixture.componentRef.setInput('errorMessage', 'Campo obrigatório');
    fixture.detectChanges();
    expect(el.querySelector('.input-error-msg')?.textContent?.trim()).toBe('Campo obrigatório');

    fixture.componentRef.setInput('hasError', false);
    fixture.detectChanges();
    expect(el.querySelector('.input-error-msg')).toBeNull();
  });
});
