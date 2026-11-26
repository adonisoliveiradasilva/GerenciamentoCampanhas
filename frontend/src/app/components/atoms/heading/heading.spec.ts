import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Heading } from './heading';

describe('Heading', () => {
  let fixture: ComponentFixture<Heading>;
  let component: Heading;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Heading],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Heading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with undefined default inputs', () => {
    expect(component).toBeTruthy();
    expect(component.title()).toBeUndefined();
    expect(component.subtitle()).toBeUndefined();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1.heading')?.textContent?.trim()).toBe('');
    expect(el.querySelector('h4.subtitle')?.textContent?.trim()).toBe('');
  });

  it('should render title and subtitle when provided', () => {
    fixture.componentRef.setInput('title', 'Bem-vindo');
    fixture.componentRef.setInput('subtitle', 'Gerencie suas campanhas');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1.heading')?.textContent?.trim()).toBe('Bem-vindo');
    expect(el.querySelector('h4.subtitle')?.textContent?.trim()).toBe('Gerencie suas campanhas');
  });

  it('should update rendered heading when inputs change', () => {
    fixture.componentRef.setInput('title', 'Título Atualizado');
    fixture.componentRef.setInput('subtitle', 'Subtítulo Atualizado');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1.heading')?.textContent?.trim()).toBe('Título Atualizado');
    expect(el.querySelector('h4.subtitle')?.textContent?.trim()).toBe('Subtítulo Atualizado');
  });
});
