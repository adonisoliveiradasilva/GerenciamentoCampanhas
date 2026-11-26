import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  let component: StatCard;
  let fixture: ComponentFixture<StatCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCard],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(StatCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Total de Doações');
    fixture.componentRef.setInput('value', 142);
    fixture.componentRef.setInput('icon', 'fa-box-open');
    fixture.detectChanges();
  });

  it('should create and render title, numeric value, icon, and default primary theme', () => {
    expect(component).toBeTruthy();

    const titleEl: HTMLElement = fixture.nativeElement.querySelector('.stat-title');
    const valueEl: HTMLElement = fixture.nativeElement.querySelector('.stat-value');
    const iconWrapper: HTMLElement = fixture.nativeElement.querySelector('.stat-icon-wrapper');
    const iconEl: HTMLElement = fixture.nativeElement.querySelector('.stat-icon-wrapper i');

    expect(titleEl.textContent?.trim()).toBe('Total de Doações');
    expect(valueEl.textContent?.trim()).toBe('142');
    expect(iconWrapper.classList.contains('primary')).toBeTrue();
    expect(iconEl.classList.contains('fa-solid')).toBeTrue();
    expect(iconEl.classList.contains('fa-box-open')).toBeTrue();
  });

  it('should support string values and custom themes', () => {
    fixture.componentRef.setInput('value', 'R$ 5.200,00');
    fixture.componentRef.setInput('theme', 'success');
    fixture.detectChanges();

    const valueEl: HTMLElement = fixture.nativeElement.querySelector('.stat-value');
    const iconWrapper: HTMLElement = fixture.nativeElement.querySelector('.stat-icon-wrapper');

    expect(valueEl.textContent?.trim()).toBe('R$ 5.200,00');
    expect(iconWrapper.classList.contains('success')).toBeTrue();
    expect(iconWrapper.classList.contains('primary')).toBeFalse();
  });

  it('should render lumen-loading with loadingLabel when isLoading is true', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('loadingLabel', 'Buscando métricas...');
    fixture.detectChanges();

    const loadingEl = fixture.nativeElement.querySelector('lumen-loading');
    const statContent = fixture.nativeElement.querySelector('.stat-content');

    expect(loadingEl).toBeTruthy();
    expect(loadingEl.textContent).toContain('Buscando métricas...');
    expect(statContent).toBeNull();
  });

  it('should restore stat content when isLoading returns to false', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.stat-content')).toBeNull();

    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('lumen-loading')).toBeNull();
    expect(fixture.nativeElement.querySelector('.stat-content')).toBeTruthy();
  });
});
