import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Link } from './link';

describe('Link', () => {
  let fixture: ComponentFixture<Link>;
  let component: Link;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Link],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Link);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Ver campanhas');
    fixture.componentRef.setInput('to', '/campaigns');
    fixture.detectChanges();
  });

  it('should create and render an internal routerLink anchor by default', () => {
    expect(component).toBeTruthy();
    expect(component.text()).toBe('Ver campanhas');
    expect(component.to()).toBe('/campaigns');
    expect(component.isExternal()).toBeFalse();

    const anchor = (fixture.nativeElement as HTMLElement).querySelector('a.lumen-link') as HTMLAnchorElement;
    expect(anchor).toBeTruthy();
    expect(anchor.textContent?.trim()).toBe('Ver campanhas');
    expect(anchor.getAttribute('href')).toBe('/campaigns');
    expect(anchor.getAttribute('target')).toBeNull();
    expect(anchor.getAttribute('rel')).toBeNull();
  });

  it('should render an external anchor with target="_blank" and rel="noopener noreferrer" when isExternal is true', () => {
    fixture.componentRef.setInput('text', 'Documentação');
    fixture.componentRef.setInput('to', 'https://example.com/docs');
    fixture.componentRef.setInput('isExternal', true);
    fixture.detectChanges();

    const anchor = (fixture.nativeElement as HTMLElement).querySelector('a.lumen-link') as HTMLAnchorElement;
    expect(anchor).toBeTruthy();
    expect(anchor.textContent?.trim()).toBe('Documentação');
    expect(anchor.getAttribute('href')).toBe('https://example.com/docs');
    expect(anchor.getAttribute('target')).toBe('_blank');
    expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
