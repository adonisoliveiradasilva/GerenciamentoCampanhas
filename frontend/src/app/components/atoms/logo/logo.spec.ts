import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Logo, LogoSize, LogoTheme } from './logo';

describe('Logo', () => {
  let fixture: ComponentFixture<Logo>;
  let component: Logo;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Logo],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Logo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with default size "medium" and theme "light"', () => {
    expect(component).toBeTruthy();
    expect(component.size()).toBe('medium');
    expect(component.theme()).toBe('light');

    const el = fixture.nativeElement as HTMLElement;
    const container = el.querySelector('.logo-container');
    const img = el.querySelector('img.logo-image') as HTMLImageElement;

    expect(container?.classList.contains('medium')).toBeTrue();
    expect(container?.classList.contains('light')).toBeTrue();
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('images/logo-image.png');
    expect(img.getAttribute('alt')).toBe('Logo');
  });

  const sizes: LogoSize[] = ['small', 'medium', 'large'];
  sizes.forEach((size) => {
    it(`should apply "${size}" size class`, () => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();

      const container = (fixture.nativeElement as HTMLElement).querySelector('.logo-container');
      expect(container?.classList.contains(size)).toBeTrue();
    });
  });

  const themes: LogoTheme[] = ['light', 'dark'];
  themes.forEach((theme) => {
    it(`should apply "${theme}" theme class`, () => {
      fixture.componentRef.setInput('theme', theme);
      fixture.detectChanges();

      const container = (fixture.nativeElement as HTMLElement).querySelector('.logo-container');
      expect(container?.classList.contains(theme)).toBeTrue();
    });
  });
});
