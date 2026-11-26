import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ConfirmationModal } from './confirmation-modal';
import { ConfirmationModalService } from '../../../domains/confirmation-modal/services/confirmation-modal';

describe('ConfirmationModal', () => {
  let component: ConfirmationModal;
  let fixture: ComponentFixture<ConfirmationModal>;
  let service: ConfirmationModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationModal],
      providers: [provideZonelessChangeDetection(), ConfirmationModalService],
    }).compileComponents();

    service = TestBed.inject(ConfirmationModalService);
    fixture = TestBed.createComponent(ConfirmationModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create and append host element to document.body on init', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.parentNode).toBe(document.body);
  });

  it('should remove host element from document.body on destroy', () => {
    const hostEl: HTMLElement = fixture.nativeElement;
    expect(document.body.contains(hostEl)).toBeTrue();

    fixture.destroy();

    expect(document.body.contains(hostEl)).toBeFalse();
  });

  it('should not render modal backdrop when state is empty', () => {
    const backdrop = fixture.nativeElement.querySelector('.confirmation-backdrop');
    expect(backdrop).toBeNull();
  });

  it('should render modal content when service.open is called', () => {
    service.open({
      title: 'Excluir Campanha',
      subtitle: 'Esta ação não pode ser desfeita.',
      message: 'Todos os itens vinculados serão removidos.',
      type: 'danger',
      confirmText: 'Sim, excluir',
      cancelText: 'Manter',
    });
    fixture.detectChanges();

    const box = fixture.nativeElement.querySelector('.confirmation-box');
    const title = fixture.nativeElement.querySelector('.confirmation-title span');
    const subtitle = fixture.nativeElement.querySelector('.confirmation-subtitle span');
    const buttons = fixture.nativeElement.querySelectorAll('.confirmation-actions lumen-button button');

    expect(box).toBeTruthy();
    expect(box.classList.contains('theme-danger')).toBeTrue();
    expect(title.textContent.trim()).toBe('Excluir Campanha');
    expect(subtitle.textContent.trim()).toBe('Esta ação não pode ser desfeita.');
    expect(fixture.nativeElement.textContent).toContain('Todos os itens vinculados serão removidos.');
    expect(buttons[0].textContent.trim()).toBe('Manter');
    expect(buttons[1].textContent.trim()).toBe('Sim, excluir');
  });

  it('should emit true, complete outcome$, and close modal when confirm button is clicked', () => {
    const closeSpy = spyOn(service, 'close').and.callThrough();
    const results: boolean[] = [];
    let completed = false;

    service.open({ message: 'Confirmar ação?' }).subscribe({
      next: (val) => results.push(val),
      complete: () => (completed = true),
    });
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.confirmation-actions lumen-button button');
    buttons[1].click();
    fixture.detectChanges();

    expect(results).toEqual([true]);
    expect(completed).toBeTrue();
    expect(closeSpy).toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.confirmation-backdrop')).toBeNull();
  });

  it('should emit false, complete outcome$, and close modal when cancel button is clicked', () => {
    const closeSpy = spyOn(service, 'close').and.callThrough();
    const results: boolean[] = [];
    let completed = false;

    service.open({ message: 'Deseja cancelar?' }).subscribe({
      next: (val) => results.push(val),
      complete: () => (completed = true),
    });
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.confirmation-actions lumen-button button');
    buttons[0].click();
    fixture.detectChanges();

    expect(results).toEqual([false]);
    expect(completed).toBeTrue();
    expect(closeSpy).toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.confirmation-backdrop')).toBeNull();
  });

  it('should cancel and close modal when close icon button is clicked', () => {
    const results: boolean[] = [];
    service.open({ message: 'Fechar pelo X' }).subscribe((val) => results.push(val));
    fixture.detectChanges();

    const closeBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.close-btn');
    closeBtn.click();
    fixture.detectChanges();

    expect(results).toEqual([false]);
    expect(fixture.nativeElement.querySelector('.confirmation-backdrop')).toBeNull();
  });

  it('should cancel and close modal when clicking on the backdrop', () => {
    const results: boolean[] = [];
    service.open({ message: 'Clique no backdrop' }).subscribe((val) => results.push(val));
    fixture.detectChanges();

    const backdrop: HTMLElement = fixture.nativeElement.querySelector('.confirmation-backdrop');
    backdrop.click();
    fixture.detectChanges();

    expect(results).toEqual([false]);
    expect(fixture.nativeElement.querySelector('.confirmation-backdrop')).toBeNull();
  });

  it('should NOT close modal when clicking inside the confirmation box', () => {
    const closeSpy = spyOn(service, 'close').and.callThrough();
    service.open({ message: 'Clique interno' }).subscribe();
    fixture.detectChanges();

    const box: HTMLElement = fixture.nativeElement.querySelector('.confirmation-box');
    box.click();
    fixture.detectChanges();

    expect(closeSpy).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.confirmation-backdrop')).toBeTruthy();
  });
});
