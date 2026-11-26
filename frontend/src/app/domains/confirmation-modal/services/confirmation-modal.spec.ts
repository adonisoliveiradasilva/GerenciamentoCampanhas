import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConfirmationModalService } from './confirmation-modal';

describe('ConfirmationModalService', () => {
  let service: ConfirmationModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(ConfirmationModalService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve aplicar valores padrão ao abrir modal com configuração mínima', () => {
    let emittedState: any;
    const sub = service.state$.subscribe((state) => {
      emittedState = state;
    });

    service.open({ message: 'Deseja prosseguir?' });

    expect(emittedState).toBeTruthy();
    expect(emittedState.config).toEqual({
      title: 'Confirmação',
      subtitle: '',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      confirmIcon: 'fas fa-circle-info',
      cancelIcon: 'fas fa-ban',
      type: 'info',
      icon: 'fas fa-circle-info',
      message: 'Deseja prosseguir?'
    });

    sub.unsubscribe();
  });

  it('deve escolher ícones padrão conforme o tipo informado', () => {
    const states: any[] = [];
    const sub = service.state$.subscribe((state) => states.push(state));

    service.open({ message: 'Excluir?', type: 'danger' });
    service.open({ message: 'Atenção', type: 'warning' });
    service.open({ message: 'Concluído', type: 'success' });

    expect(states[0].config.icon).toBe('fas fa-trash-can');
    expect(states[0].config.confirmIcon).toBe('fas fa-trash-can');
    expect(states[1].config.icon).toBe('fas fa-triangle-exclamation');
    expect(states[2].config.icon).toBe('fas fa-check');

    sub.unsubscribe();
  });

  it('deve preservar todas as opções personalizadas fornecidas na configuração', () => {
    let emittedState: any;
    const sub = service.state$.subscribe((state) => {
      emittedState = state;
    });

    service.open({
      title: 'Remover Registro',
      subtitle: 'Ação irreversível',
      message: 'Confirma a remoção?',
      type: 'danger',
      confirmText: 'Sim, remover',
      cancelText: 'Voltar',
      icon: 'fa-solid fa-skull',
      confirmIcon: 'fa-solid fa-check-double',
      cancelIcon: 'fa-solid fa-arrow-left'
    });

    expect(emittedState.config).toEqual({
      title: 'Remover Registro',
      subtitle: 'Ação irreversível',
      message: 'Confirma a remoção?',
      type: 'danger',
      confirmText: 'Sim, remover',
      cancelText: 'Voltar',
      icon: 'fa-solid fa-skull',
      confirmIcon: 'fa-solid fa-check-double',
      cancelIcon: 'fa-solid fa-arrow-left'
    });

    sub.unsubscribe();
  });

  it('deve retornar um observable que recebe a decisão emitida pelo outcome$', () => {
    let emittedState: any;
    const sub = service.state$.subscribe((state) => {
      emittedState = state;
    });

    const results: boolean[] = [];
    service.open({ message: 'Confirmar ação?' }).subscribe((res) => results.push(res));

    emittedState.outcome$.next(true);
    emittedState.outcome$.next(false);
    emittedState.outcome$.complete();

    expect(results).toEqual([true, false]);

    sub.unsubscribe();
  });

  it('deve emitir null no state$ ao chamar close()', () => {
    const emissions: any[] = [];
    const sub = service.state$.subscribe((state) => emissions.push(state));

    service.open({ message: 'Abrir' });
    service.close();

    expect(emissions.length).toBe(2);
    expect(emissions[0]).toBeTruthy();
    expect(emissions[1]).toBeNull();

    sub.unsubscribe();
  });
});
