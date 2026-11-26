import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchInput } from './search-input';

describe('SearchInput', () => {
  let fixture: ComponentFixture<SearchInput>;
  let component: SearchInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInput],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with default placeholder and width', () => {
    expect(component).toBeTruthy();
    expect(component.placeholder()).toBe('');
    expect(component.width()).toBe('100%');

    const el = fixture.nativeElement as HTMLElement;
    const container = el.querySelector('.search-input-content') as HTMLElement;
    const icon = el.querySelector('i.fa-magnifying-glass');
    const inputEl = el.querySelector('input') as HTMLInputElement;

    expect(container.style.width).toBe('100%');
    expect(icon).toBeTruthy();
    expect(inputEl.placeholder).toBe('');
  });

  it('should apply custom placeholder and width', () => {
    fixture.componentRef.setInput('placeholder', 'Buscar campanha...');
    fixture.componentRef.setInput('width', '320px');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const container = el.querySelector('.search-input-content') as HTMLElement;
    const inputEl = el.querySelector('input') as HTMLInputElement;

    expect(container.style.width).toBe('320px');
    expect(inputEl.placeholder).toBe('Buscar campanha...');
  });

  it('should emit searchChange with typed value on input event', () => {
    const emitSpy = spyOn(component.searchChange, 'emit');
    const inputEl = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;

    inputEl.value = 'Black Friday';
    inputEl.dispatchEvent(new Event('input'));
    expect(emitSpy).toHaveBeenCalledWith('Black Friday');

    inputEl.value = '';
    inputEl.dispatchEvent(new Event('input'));
    expect(emitSpy).toHaveBeenCalledWith('');
    expect(emitSpy).toHaveBeenCalledTimes(2);
  });
});
