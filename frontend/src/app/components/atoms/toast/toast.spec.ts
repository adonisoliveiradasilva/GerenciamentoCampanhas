import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IToast } from '../../../domains/toast/modal/toast.model';
import { Toast } from './toast';

describe('Toast', () => {
  let fixture: ComponentFixture<Toast>;
  let component: Toast;

  const baseToast: IToast = {
    id: 'toast-1',
    type: 'success',
    message: 'Campanha criada com sucesso!',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toast],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', baseToast);
    fixture.detectChanges();
  });

  it('should create and render success toast with check-circle icon', () => {
    expect(component).toBeTruthy();
    expect(component.data()).toEqual(baseToast);

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.toast-box')?.classList.contains('success')).toBeTrue();
    expect(el.querySelector('.toast-content i.fa-check-circle')).toBeTruthy();
    expect(el.querySelector('.message')?.textContent?.trim()).toBe('Campanha criada com sucesso!');
  });

  it('should render error toast with exclamation-circle icon', () => {
    fixture.componentRef.setInput('data', {
      id: 'toast-2',
      type: 'error',
      message: 'Erro ao salvar campanha.',
    } as IToast);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.toast-box')?.classList.contains('error')).toBeTrue();
    expect(el.querySelector('.toast-content i.fa-exclamation-circle')).toBeTruthy();
    expect(el.querySelector('.message')?.textContent?.trim()).toBe('Erro ao salvar campanha.');
  });

  it('should render warning toast with triangle-exclamation icon', () => {
    fixture.componentRef.setInput('data', {
      id: 'toast-3',
      type: 'warning',
      message: 'Orçamento próximo do limite.',
    } as IToast);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.toast-box')?.classList.contains('warning')).toBeTrue();
    expect(el.querySelector('.toast-content i.fa-triangle-exclamation')).toBeTruthy();
    expect(el.querySelector('.message')?.textContent?.trim()).toBe('Orçamento próximo do limite.');
  });

  it('should render info toast without status icon inside toast-content', () => {
    fixture.componentRef.setInput('data', {
      id: 'toast-4',
      type: 'info',
      message: 'Atualização disponível.',
    } as IToast);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.toast-box')?.classList.contains('info')).toBeTrue();
    expect(el.querySelector('.toast-content i')).toBeNull();
    expect(el.querySelector('.message')?.textContent?.trim()).toBe('Atualização disponível.');
  });

  it('should emit closeToast with toast id when close button is clicked', () => {
    const emitSpy = spyOn(component.closeToast, 'emit');
    const closeBtn = (fixture.nativeElement as HTMLElement).querySelector('.close-btn') as HTMLButtonElement;

    closeBtn.click();
    expect(emitSpy).toHaveBeenCalledOnceWith('toast-1');
  });
});
