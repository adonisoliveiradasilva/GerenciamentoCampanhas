import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleIcon } from './circle-icon';

describe('CircleIcon', () => {
  let fixture: ComponentFixture<CircleIcon>;
  let component: CircleIcon;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleIcon],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with default empty inputs', () => {
    expect(component).toBeTruthy();
    expect(component.icon()).toBe('');
    expect(component.bgColor()).toBe('');
    expect(component.iconColor()).toBe('');

    const container = (fixture.nativeElement as HTMLElement).querySelector('.circle-icon-content') as HTMLElement;
    expect(container).toBeTruthy();
    expect(container.style.backgroundColor).toBe('');
    expect(container.style.color).toBe('');
  });

  it('should apply icon class, background color, and icon color styles', () => {
    fixture.componentRef.setInput('icon', 'fa-bullhorn');
    fixture.componentRef.setInput('bgColor', 'rgb(230, 240, 255)');
    fixture.componentRef.setInput('iconColor', 'rgb(0, 82, 204)');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const container = el.querySelector('.circle-icon-content') as HTMLElement;
    const iconEl = el.querySelector('i') as HTMLElement;

    expect(container.style.backgroundColor).toBe('rgb(230, 240, 255)');
    expect(container.style.color).toBe('rgb(0, 82, 204)');
    expect(iconEl.classList.contains('fa-bullhorn')).toBeTrue();
  });

  it('should update styles and icon class dynamically', () => {
    fixture.componentRef.setInput('icon', 'fa-check');
    fixture.componentRef.setInput('bgColor', 'rgb(220, 252, 231)');
    fixture.componentRef.setInput('iconColor', 'rgb(22, 163, 74)');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const container = el.querySelector('.circle-icon-content') as HTMLElement;
    const iconEl = el.querySelector('i') as HTMLElement;

    expect(container.style.backgroundColor).toBe('rgb(220, 252, 231)');
    expect(container.style.color).toBe('rgb(22, 163, 74)');
    expect(iconEl.classList.contains('fa-check')).toBeTrue();
  });
});
