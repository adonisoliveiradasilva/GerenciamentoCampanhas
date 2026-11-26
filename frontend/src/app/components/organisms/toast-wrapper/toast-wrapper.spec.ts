import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastWrapper } from './toast-wrapper';
import { ToastService } from '../../../domains/toast/services/toast-service';
import { IToast } from '../../../domains/toast/modal/toast.model';

describe('ToastWrapper', () => {
  let component: ToastWrapper;
  let fixture: ComponentFixture<ToastWrapper>;
  let toastsSubject: BehaviorSubject<IToast[]>;
  let toastServiceMock: { toasts$: BehaviorSubject<IToast[]>; remove: jasmine.Spy };

  beforeEach(async () => {
    toastsSubject = new BehaviorSubject<IToast[]>([]);
    toastServiceMock = {
      toasts$: toastsSubject,
      remove: jasmine.createSpy('remove'),
    };

    await TestBed.configureTestingModule({
      imports: [ToastWrapper],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and render no toasts initially', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('lumen-toast').length).toBe(0);
  });

  it('should render a lumen-toast for each emitted toast', () => {
    const toasts: IToast[] = [
      { id: 't1', type: 'success', message: 'Salvo com sucesso!' },
      { id: 't2', type: 'error', message: 'Erro ao salvar.' },
    ];
    toastsSubject.next(toasts);
    fixture.detectChanges();

    const toastEls: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('lumen-toast');
    expect(toastEls.length).toBe(2);
    expect(toastEls[0].textContent).toContain('Salvo com sucesso!');
    expect(toastEls[0].querySelector('.toast-box')?.classList.contains('success')).toBeTrue();
    expect(toastEls[1].textContent).toContain('Erro ao salvar.');
    expect(toastEls[1].querySelector('.toast-box')?.classList.contains('error')).toBeTrue();
  });

  it('should call toastService.remove when a child toast emits closeToast', () => {
    toastsSubject.next([{ id: 'toast-42', type: 'warning', message: 'Aviso importante' }]);
    fixture.detectChanges();

    const closeBtn: HTMLButtonElement = fixture.nativeElement.querySelector('lumen-toast .close-btn');
    closeBtn.click();

    expect(toastServiceMock.remove).toHaveBeenCalledOnceWith('toast-42');
  });

  it('should update rendered list when toasts$ emits updated array', () => {
    toastsSubject.next([
      { id: '1', type: 'info', message: 'Primeiro' },
      { id: '2', type: 'success', message: 'Segundo' },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('lumen-toast').length).toBe(2);

    toastsSubject.next([{ id: '2', type: 'success', message: 'Segundo' }]);
    fixture.detectChanges();

    const remaining = fixture.nativeElement.querySelectorAll('lumen-toast');
    expect(remaining.length).toBe(1);
    expect(remaining[0].textContent).toContain('Segundo');
  });
});
