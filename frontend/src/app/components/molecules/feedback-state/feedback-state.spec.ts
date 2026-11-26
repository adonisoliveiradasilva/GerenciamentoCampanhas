import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FeedbackState, StateType } from './feedback-state';

describe('FeedbackState', () => {
  let component: FeedbackState;
  let fixture: ComponentFixture<FeedbackState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackState],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with default input values', () => {
    expect(component).toBeTruthy();
    expect(component.icon()).toBe('fa-inbox');
    expect(component.type()).toBe('empty');
    expect(component.label()).toBe('Nenhum dado encontrado.');
  });

  it('should render default class, icon, and label in the DOM', () => {
    const container: HTMLElement = fixture.nativeElement.querySelector('.empty-state-container');
    const iconEl: HTMLElement = fixture.nativeElement.querySelector('.empty-icon');
    const labelEl: HTMLElement = fixture.nativeElement.querySelector('.empty-label');

    expect(container.classList.contains('empty')).toBeTrue();
    expect(iconEl.classList.contains('fa-solid')).toBeTrue();
    expect(iconEl.classList.contains('fa-inbox')).toBeTrue();
    expect(labelEl.textContent?.trim()).toBe('Nenhum dado encontrado.');
  });

  it('should render custom icon, type, and label inputs', () => {
    fixture.componentRef.setInput('icon', 'fa-triangle-exclamation');
    fixture.componentRef.setInput('type', 'warning');
    fixture.componentRef.setInput('label', 'Atenção aos dados.');
    fixture.detectChanges();

    const container: HTMLElement = fixture.nativeElement.querySelector('.empty-state-container');
    const iconEl: HTMLElement = fixture.nativeElement.querySelector('.empty-icon');
    const labelEl: HTMLElement = fixture.nativeElement.querySelector('.empty-label');

    expect(container.classList.contains('warning')).toBeTrue();
    expect(container.classList.contains('empty')).toBeFalse();
    expect(iconEl.classList.contains('fa-triangle-exclamation')).toBeTrue();
    expect(labelEl.textContent?.trim()).toBe('Atenção aos dados.');
  });

  it('should support all StateType variants', () => {
    const types: StateType[] = ['success', 'error', 'warning', 'info', 'empty'];
    const container: HTMLElement = fixture.nativeElement.querySelector('.empty-state-container');

    for (const type of types) {
      fixture.componentRef.setInput('type', type);
      fixture.detectChanges();
      expect(container.classList.contains(type)).toBeTrue();
    }
  });
});
