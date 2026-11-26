import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertIcon, AlertType } from './alert-icon';

describe('AlertIcon', () => {
  let fixture: ComponentFixture<AlertIcon>;
  let component: AlertIcon;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertIcon],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertIcon);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('icon', 'fas fa-circle-info');
    fixture.componentRef.setInput('text', 'Informação importante');
    fixture.detectChanges();
  });

  it('should create with required inputs and default type "info"', () => {
    expect(component).toBeTruthy();
    expect(component.type()).toBe('info');
    expect(component.icon()).toBe('fas fa-circle-info');
    expect(component.text()).toBe('Informação importante');

    const el = fixture.nativeElement as HTMLElement;
    const container = el.querySelector('.alert-icon-content');
    const icon = el.querySelector('i');
    const text = el.querySelector('span');

    expect(container?.classList.contains('theme-info')).toBeTrue();
    expect(icon?.classList.contains('fas')).toBeTrue();
    expect(icon?.classList.contains('fa-circle-info')).toBeTrue();
    expect(text?.textContent?.trim()).toBe('Informação importante');
  });

  const alertTypes: Exclude<AlertType, undefined>[] = ['info', 'warning', 'danger', 'success'];
  alertTypes.forEach((alertType) => {
    it(`should apply theme-${alertType} class when type is "${alertType}"`, () => {
      fixture.componentRef.setInput('type', alertType);
      fixture.detectChanges();

      const container = (fixture.nativeElement as HTMLElement).querySelector('.alert-icon-content');
      expect(container?.classList.contains(`theme-${alertType}`)).toBeTrue();
    });
  });

  it('should update icon class and text when inputs change', () => {
    fixture.componentRef.setInput('icon', 'fas fa-triangle-exclamation');
    fixture.componentRef.setInput('text', 'Atenção necessária');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('i')?.classList.contains('fas')).toBeTrue();
    expect(el.querySelector('i')?.classList.contains('fa-triangle-exclamation')).toBeTrue();
    expect(el.querySelector('span')?.textContent?.trim()).toBe('Atenção necessária');
  });
});
