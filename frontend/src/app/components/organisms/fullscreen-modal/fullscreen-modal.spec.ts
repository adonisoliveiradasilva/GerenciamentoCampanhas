import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FullscreenModal } from './fullscreen-modal';

@Component({
  standalone: true,
  imports: [FullscreenModal],
  template: `
    <lumen-fullscreen-modal [title]="title" [icon]="icon" (onClose)="closedCount = closedCount + 1">
      <p class="projected-body">Conteúdo do modal</p>
      <button modal-actions class="projected-action">Salvar</button>
    </lumen-fullscreen-modal>
  `,
})
class TestHostComponent {
  title = 'Visualizar Detalhes';
  icon = 'fa-solid fa-eye';
  closedCount = 0;
}

describe('FullscreenModal', () => {
  let component: FullscreenModal;
  let fixture: ComponentFixture<FullscreenModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullscreenModal, TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(FullscreenModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Detalhes da Campanha');
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create, render title with default icon, and append host element to document.body', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.parentNode).toBe(document.body);

    const titleEl: HTMLElement = fixture.nativeElement.querySelector('.fullscreen-header .title span');
    const iconEl: HTMLElement = fixture.nativeElement.querySelector('.fullscreen-header .title i');

    expect(titleEl.textContent?.trim()).toBe('Detalhes da Campanha');
    expect(iconEl.classList.contains('fa-solid')).toBeTrue();
    expect(iconEl.classList.contains('fa-expand')).toBeTrue();
  });

  it('should render custom icon input', () => {
    fixture.componentRef.setInput('icon', 'fa-solid fa-box');
    fixture.detectChanges();

    const iconEl: HTMLElement = fixture.nativeElement.querySelector('.fullscreen-header .title i');
    expect(iconEl.classList.contains('fa-solid')).toBeTrue();
    expect(iconEl.classList.contains('fa-box')).toBeTrue();
  });

  it('should remove host element from document.body on destroy', () => {
    const hostEl: HTMLElement = fixture.nativeElement;
    expect(document.body.contains(hostEl)).toBeTrue();

    fixture.destroy();

    expect(document.body.contains(hostEl)).toBeFalse();
  });

  it('should emit onClose when close button is clicked', () => {
    const closeSpy = jasmine.createSpy('onClose');
    component.onClose.subscribe(closeSpy);

    const closeBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.close-btn');
    closeBtn.click();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit onClose when clicking on backdrop', () => {
    const closeSpy = jasmine.createSpy('onClose');
    component.onClose.subscribe(closeSpy);

    const backdrop: HTMLElement = fixture.nativeElement.querySelector('.fullscreen-backdrop');
    backdrop.click();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('should NOT emit onClose when clicking inside fullscreen-box', () => {
    const closeSpy = jasmine.createSpy('onClose');
    component.onClose.subscribe(closeSpy);

    const box: HTMLElement = fixture.nativeElement.querySelector('.fullscreen-box');
    box.click();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should project body content and modal-actions footer content', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    try {
      const modalEl = document.body.querySelector('lumen-fullscreen-modal:last-of-type')!;
      const projectedBody = modalEl.querySelector('.fullscreen-content .projected-body');
      const projectedAction = modalEl.querySelector('.fullscreen-actions .projected-action');

      expect(projectedBody?.textContent?.trim()).toBe('Conteúdo do modal');
      expect(projectedAction?.textContent?.trim()).toBe('Salvar');
    } finally {
      hostFixture.destroy();
    }
  });
});
