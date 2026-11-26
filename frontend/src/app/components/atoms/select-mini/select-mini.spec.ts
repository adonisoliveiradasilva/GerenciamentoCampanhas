import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectMini } from './select-mini';

describe('SelectMini', () => {
  let fixture: ComponentFixture<SelectMini>;
  let component: SelectMini;

  const mockOptions = [
    { label: 'Últimos 7 dias', value: '7d' },
    { label: 'Últimos 30 dias', value: '30d' },
    { label: 'Este ano', value: '1y' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMini],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectMini);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();
  });

  it('should create closed by default with placeholder label "Selecione..."', () => {
    expect(component).toBeTruthy();
    expect(component.isOpen()).toBeFalse();
    expect(component.disabled()).toBeFalse();
    expect(component.showSearch()).toBeTrue();
    expect(component.value()).toBe('');
    expect(component.selectedLabel()).toBe('Selecione...');

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.trigger-label')?.textContent?.trim()).toBe('Selecione...');
    expect(el.querySelector('.select-menu')).toBeNull();
  });

  it('should display matching option label when value is set', () => {
    fixture.componentRef.setInput('value', '30d');
    fixture.detectChanges();

    expect(component.selectedLabel()).toBe('Últimos 30 dias');
    expect((fixture.nativeElement as HTMLElement).querySelector('.trigger-label')?.textContent?.trim()).toBe(
      'Últimos 30 dias',
    );
  });

  it('should toggle dropdown on trigger click and reset searchQuery when reopening', () => {
    const el = fixture.nativeElement as HTMLElement;
    const triggerBtn = el.querySelector('.select-trigger') as HTMLButtonElement;

    triggerBtn.click();
    fixture.detectChanges();

    expect(component.isOpen()).toBeTrue();
    expect(el.querySelector('.select-menu')).toBeTruthy();
    expect(el.querySelector('.trigger-icon')?.classList.contains('open')).toBeTrue();
    expect(el.querySelectorAll('.select-menu-item').length).toBe(3);

    component.searchQuery.set('ano');
    triggerBtn.click();
    fixture.detectChanges();
    expect(component.isOpen()).toBeFalse();

    triggerBtn.click();
    fixture.detectChanges();
    expect(component.isOpen()).toBeTrue();
    expect(component.searchQuery()).toBe('');
  });

  it('should not open dropdown when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const triggerBtn = el.querySelector('.select-trigger') as HTMLButtonElement;

    expect(el.querySelector('.lumen-select-mini-container')?.classList.contains('disabled')).toBeTrue();
    expect(triggerBtn.disabled).toBeTrue();

    component.toggleDropdown(new MouseEvent('click'));
    fixture.detectChanges();
    expect(component.isOpen()).toBeFalse();
    expect(el.querySelector('.select-menu')).toBeNull();
  });

  it('should select an option, update value model, close dropdown, and mark item as selected when reopened', () => {
    const el = fixture.nativeElement as HTMLElement;
    const triggerBtn = el.querySelector('.select-trigger') as HTMLButtonElement;

    triggerBtn.click();
    fixture.detectChanges();

    const items = el.querySelectorAll('.select-menu-item');
    (items[1] as HTMLElement).click();
    fixture.detectChanges();

    expect(component.value()).toBe('30d');
    expect(component.selectedLabel()).toBe('Últimos 30 dias');
    expect(component.isOpen()).toBeFalse();
    expect(el.querySelector('.select-menu')).toBeNull();

    triggerBtn.click();
    fixture.detectChanges();

    const reopenedItems = el.querySelectorAll('.select-menu-item');
    expect(reopenedItems[1].classList.contains('selected')).toBeTrue();
    expect(reopenedItems[0].classList.contains('selected')).toBeFalse();
  });

  it('should filter options by search query and display empty message when no matches exist', () => {
    const el = fixture.nativeElement as HTMLElement;
    (el.querySelector('.select-trigger') as HTMLButtonElement).click();
    fixture.detectChanges();

    const searchInput = el.querySelector('.select-search-input') as HTMLInputElement;
    searchInput.value = '  DIAS ';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.filteredOptions().length).toBe(2);
    expect(el.querySelectorAll('.select-menu-item').length).toBe(2);

    searchInput.value = 'inexistente';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.filteredOptions().length).toBe(0);
    expect(el.querySelector('.select-menu-empty')?.textContent?.trim()).toBe('Nenhum resultado encontrado');
  });

  it('should hide search input when showSearch is false', () => {
    fixture.componentRef.setInput('showSearch', false);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    (el.querySelector('.select-trigger') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(el.querySelector('.select-search-wrapper')).toBeNull();
  });

  it('should keep dropdown open when clicking search wrapper and close when clicking outside', () => {
    const el = fixture.nativeElement as HTMLElement;
    (el.querySelector('.select-trigger') as HTMLButtonElement).click();
    fixture.detectChanges();

    const searchWrapper = el.querySelector('.select-search-wrapper') as HTMLElement;
    searchWrapper.click();
    fixture.detectChanges();
    expect(component.isOpen()).toBeTrue();

    document.body.click();
    fixture.detectChanges();
    expect(component.isOpen()).toBeFalse();
    expect(el.querySelector('.select-menu')).toBeNull();
  });
});
