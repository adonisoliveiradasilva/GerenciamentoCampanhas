import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast-service';
import { IToast } from '../modal/toast.model';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(ToastService);
  });

  it('deve ser criado com lista de toasts inicialmente vazia', () => {
    let toasts: IToast[] = [];
    const sub = service.toasts$.subscribe((list) => {
      toasts = list;
    });

    expect(service).toBeTruthy();
    expect(toasts).toEqual([]);
    sub.unsubscribe();
  });

  it('deve adicionar toasts com id, tipo e mensagem mantendo os anteriores', () => {
    let toasts: IToast[] = [];
    const sub = service.toasts$.subscribe((list) => {
      toasts = list;
    });

    service.show('success', 'Operação concluída', 0);
    service.show('error', 'Falha na requisição', 0);

    expect(toasts.length).toBe(2);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].message).toBe('Operação concluída');
    expect(toasts[0].id).toBeTruthy();
    expect(toasts[1].type).toBe('error');
    expect(toasts[1].message).toBe('Falha na requisição');
    expect(toasts[1].id).not.toBe(toasts[0].id);

    sub.unsubscribe();
  });

  it('deve remover apenas o toast correspondente ao id informado', () => {
    let toasts: IToast[] = [];
    const sub = service.toasts$.subscribe((list) => {
      toasts = list;
    });

    service.show('info', 'Primeiro', 0);
    service.show('warning', 'Segundo', 0);

    const firstId = toasts[0].id;
    service.remove(firstId);

    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Segundo');

    sub.unsubscribe();
  });

  it('deve remover automaticamente o toast após o tempo de duração configurado', () => {
    jasmine.clock().install();
    try {
      let toasts: IToast[] = [];
      const sub = service.toasts$.subscribe((list) => {
        toasts = list;
      });

      service.show('success', 'Toast temporário', 2500);
      expect(toasts.length).toBe(1);

      jasmine.clock().tick(2499);
      expect(toasts.length).toBe(1);

      jasmine.clock().tick(1);
      expect(toasts.length).toBe(0);

      sub.unsubscribe();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('não deve agendar remoção automática quando duration for menor ou igual a 0', () => {
    jasmine.clock().install();
    try {
      let toasts: IToast[] = [];
      const sub = service.toasts$.subscribe((list) => {
        toasts = list;
      });

      service.show('warning', 'Toast persistente', 0);
      jasmine.clock().tick(10000);

      expect(toasts.length).toBe(1);
      sub.unsubscribe();
    } finally {
      jasmine.clock().uninstall();
    }
  });
});
