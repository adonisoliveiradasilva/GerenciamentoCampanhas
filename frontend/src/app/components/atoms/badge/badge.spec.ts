import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Badge, BadgeColor } from './badge';

describe('Badge', () => {
  let fixture: ComponentFixture<Badge>;
  let component: Badge;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Badge],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Badge);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Ativo');
    fixture.componentRef.setInput('icon', 'fa-check');
    fixture.detectChanges();
  });

  it('should create with required inputs and default neutral color', () => {
    expect(component).toBeTruthy();
    expect(component.label()).toBe('Ativo');
    expect(component.icon()).toBe('fa-check');
    expect(component.color()).toBe('neutral');

    const el = fixture.nativeElement as HTMLElement;
    const badgeEl = el.querySelector('.lumen-badge');
    const iconEl = el.querySelector('i');
    const labelEl = el.querySelector('span');

    expect(badgeEl?.classList.contains('neutral')).toBeTrue();
    expect(iconEl?.classList.contains('fas')).toBeTrue();
    expect(iconEl?.classList.contains('fa-check')).toBeTrue();
    expect(labelEl?.textContent?.trim()).toBe('Ativo');
  });

  const colors: BadgeColor[] = ['success', 'purple', 'warning', 'neutral', 'danger'];
  colors.forEach((color) => {
    it(`should apply "${color}" color class`, () => {
      fixture.componentRef.setInput('color', color);
      fixture.detectChanges();

      const badgeEl = (fixture.nativeElement as HTMLElement).querySelector('.lumen-badge');
      expect(badgeEl?.classList.contains(color)).toBeTrue();
    });
  });

  it('should not render icon element when icon input is empty', () => {
    fixture.componentRef.setInput('icon', '');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('i')).toBeNull();
    expect(el.querySelector('span')?.textContent?.trim()).toBe('Ativo');
  });

  it('should update rendered label and icon when inputs change', () => {
    fixture.componentRef.setInput('label', 'Pausado');
    fixture.componentRef.setInput('icon', 'fa-pause');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('span')?.textContent?.trim()).toBe('Pausado');
    expect(el.querySelector('i')?.classList.contains('fa-pause')).toBeTrue();
  });
});
