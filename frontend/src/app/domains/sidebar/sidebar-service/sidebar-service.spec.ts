import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SidebarService } from './sidebar-service';

describe('SidebarService', () => {
  const STORAGE_KEY = 'sidebar-collapsed';

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
  });

  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it('deve ser criado e iniciar expandido (false) quando não houver valor no localStorage', () => {
    const service = TestBed.inject(SidebarService);
    let collapsed: boolean | undefined;

    const sub = service.isCollapsed$.subscribe((value) => {
      collapsed = value;
    });

    expect(service).toBeTruthy();
    expect(collapsed).toBeFalse();
    sub.unsubscribe();
  });

  it('deve iniciar recolhido (true) quando localStorage tiver "true"', () => {
    localStorage.setItem(STORAGE_KEY, 'true');

    const service = TestBed.inject(SidebarService);
    let collapsed: boolean | undefined;

    const sub = service.isCollapsed$.subscribe((value) => {
      collapsed = value;
    });

    expect(collapsed).toBeTrue();
    sub.unsubscribe();
  });

  it('deve alternar o estado ao chamar toggle() e persistir no localStorage', () => {
    const service = TestBed.inject(SidebarService);
    const values: boolean[] = [];

    const sub = service.isCollapsed$.subscribe((value) => values.push(value));

    service.toggle();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('true');

    service.toggle();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('false');

    expect(values).toEqual([false, true, false]);
    sub.unsubscribe();
  });
});
