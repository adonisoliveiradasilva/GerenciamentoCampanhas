import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Breadcrumb, IBreadcrumbItem } from './breadcrumb';

describe('Breadcrumb', () => {
  let component: Breadcrumb;
  let fixture: ComponentFixture<Breadcrumb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Breadcrumb],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Breadcrumb);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render nav with breadcrumb aria-label and empty list when items is empty', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav[aria-label="breadcrumb"]');
    const listItems = fixture.nativeElement.querySelectorAll('.breadcrumb__item');
    expect(nav).toBeTruthy();
    expect(listItems.length).toBe(0);
  });

  it('should render links for non-last items with url and span with aria-current for last item', () => {
    const items: IBreadcrumbItem[] = [
      { label: 'Início', url: '/dashboard' },
      { label: 'Campanhas', url: '/campanhas' },
      { label: 'Detalhes', url: '/campanhas/1' },
    ];
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a.breadcrumb__link');
    const currentSpans = fixture.nativeElement.querySelectorAll('span.breadcrumb__current');
    const separators = fixture.nativeElement.querySelectorAll('.breadcrumb__separator');

    expect(links.length).toBe(2);
    expect(links[0].textContent.trim()).toBe('Início');
    expect(links[0].getAttribute('href')).toBe('/dashboard');
    expect(links[1].textContent.trim()).toBe('Campanhas');
    expect(links[1].getAttribute('href')).toBe('/campanhas');

    expect(currentSpans.length).toBe(1);
    expect(currentSpans[0].textContent.trim()).toBe('Detalhes');
    expect(currentSpans[0].getAttribute('aria-current')).toBe('page');

    expect(separators.length).toBe(2);
    expect(separators[0].textContent.trim()).toBe('/');
  });

  it('should render non-last item without url as a span without aria-current', () => {
    const items: IBreadcrumbItem[] = [
      { label: 'Administração' },
      { label: 'Usuários' },
    ];
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a.breadcrumb__link');
    const spans = fixture.nativeElement.querySelectorAll('span.breadcrumb__current');

    expect(links.length).toBe(0);
    expect(spans.length).toBe(2);
    expect(spans[0].textContent.trim()).toBe('Administração');
    expect(spans[0].getAttribute('aria-current')).toBeNull();
    expect(spans[1].textContent.trim()).toBe('Usuários');
    expect(spans[1].getAttribute('aria-current')).toBe('page');
  });

  it('should render no separator when there is only one item', () => {
    fixture.componentRef.setInput('items', [{ label: 'Dashboard', url: '/dashboard' }]);
    fixture.detectChanges();

    const separators = fixture.nativeElement.querySelectorAll('.breadcrumb__separator');
    const current = fixture.nativeElement.querySelector('span.breadcrumb__current');

    expect(separators.length).toBe(0);
    expect(current.textContent.trim()).toBe('Dashboard');
    expect(current.getAttribute('aria-current')).toBe('page');
  });

  it('should update rendered items when input changes', () => {
    fixture.componentRef.setInput('items', [{ label: 'Início', url: '/' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.breadcrumb__item').length).toBe(1);

    fixture.componentRef.setInput('items', [
      { label: 'Início', url: '/' },
      { label: 'Itens', url: '/itens' },
    ]);
    fixture.detectChanges();

    const listItems = fixture.nativeElement.querySelectorAll('.breadcrumb__item');
    expect(listItems.length).toBe(2);
    expect(fixture.nativeElement.querySelector('a.breadcrumb__link').textContent.trim()).toBe('Início');
    expect(fixture.nativeElement.querySelector('span.breadcrumb__current').textContent.trim()).toBe('Itens');
  });
});
