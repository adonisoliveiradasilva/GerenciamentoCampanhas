import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';

import { Itens } from './itens';
import { IItemVM, ItemService } from '../../domains/item/services/item.service';
import { CampanhaService, ICampanhaVM } from '../../domains/campanha/services/campanha.service';
import { DoadorService, IDoadorVM } from '../../domains/doador/services/doador.service';
import { ToastService } from '../../domains/toast/services/toast-service';
import { ConfirmationModalService } from '../../domains/confirmation-modal/services/confirmation-modal';

describe('Itens', () => {
  let component: Itens;
  let fixture: ComponentFixture<Itens>;
  let itemServiceSpy: jasmine.SpyObj<ItemService>;
  let campanhaServiceSpy: jasmine.SpyObj<CampanhaService>;
  let doadorServiceSpy: jasmine.SpyObj<DoadorService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let confirmationServiceSpy: jasmine.SpyObj<ConfirmationModalService>;

  const mockCampanhas: ICampanhaVM[] = [
    {
      id: 'camp-1',
      nome: 'Campanha do Agasalho',
      local: 'Igreja Central',
      descricao: '',
      dataInicio: '2026-05-01T12:00:00Z',
      dataFim: '2026-06-01T12:00:00Z'
    }
  ];

  const mockDoadores: IDoadorVM[] = [
    {
      id: 'doador-1',
      nome: 'Maria Silva',
      email: 'maria@email.com',
      dataNascimento: '1990-05-10T12:00:00Z'
    }
  ];

  const mockItens: IItemVM[] = [
    {
      id: 'item-1',
      nome: 'Casaco de Lã',
      quantidade: 5,
      dataChegada: '2026-05-15T12:00:00Z',
      campanhaId: 'camp-1',
      campanhaNome: 'Campanha do Agasalho',
      doadorId: 'doador-1',
      doadorNome: 'Maria Silva',
      historicoDoacoes: [],
      dataCriacao: '2026-05-15T12:00:00Z',
      usuarioCriadorNome: 'Admin'
    },
    {
      id: 'item-2',
      nome: 'Cobertor',
      quantidade: 2,
      dataChegada: '2026-05-16T12:00:00Z',
      campanhaId: 'camp-1',
      campanhaNome: 'Campanha do Agasalho',
      doadorNome: '',
      historicoDoacoes: [
        {
          id: 'doa-1',
          quantidade: 3,
          dataDoacao: '2026-05-17T12:00:00Z',
          destino: 'Abrigo Municipal',
          usuarioNome: 'Admin'
        }
      ],
      dataCriacao: '2026-05-16T12:00:00Z',
      usuarioCriadorNome: 'Admin'
    },
    {
      id: 'item-3',
      nome: 'Cesta Básica',
      quantidade: 0,
      dataChegada: '2026-05-18T12:00:00Z',
      campanhaId: 'camp-1',
      campanhaNome: 'Campanha do Agasalho',
      historicoDoacoes: [
        {
          id: 'doa-2',
          quantidade: 10,
          dataDoacao: '2026-05-19T12:00:00Z',
          destino: 'Famílias',
          usuarioNome: 'Admin'
        }
      ],
      dataCriacao: '2026-05-18T12:00:00Z',
      usuarioCriadorNome: 'Admin'
    }
  ];

  beforeEach(async () => {
    itemServiceSpy = jasmine.createSpyObj<ItemService>('ItemService', [
      'getAll',
      'create',
      'update',
      'delete',
      'registrarDoacao'
    ]);
    campanhaServiceSpy = jasmine.createSpyObj<CampanhaService>('CampanhaService', ['getAll']);
    doadorServiceSpy = jasmine.createSpyObj<DoadorService>('DoadorService', ['getAll']);
    toastServiceSpy = jasmine.createSpyObj<ToastService>('ToastService', ['show', 'remove']);
    confirmationServiceSpy = jasmine.createSpyObj<ConfirmationModalService>(
      'ConfirmationModalService',
      ['open', 'close']
    );

    itemServiceSpy.getAll.and.returnValue(of(mockItens));
    campanhaServiceSpy.getAll.and.returnValue(of(mockCampanhas));
    doadorServiceSpy.getAll.and.returnValue(of(mockDoadores));

    await TestBed.configureTestingModule({
      imports: [Itens],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync('noop'),
        { provide: ItemService, useValue: itemServiceSpy },
        { provide: CampanhaService, useValue: campanhaServiceSpy },
        { provide: DoadorService, useValue: doadorServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ConfirmationModalService, useValue: confirmationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Itens);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load items and map stock status, arrival date and default donor name', () => {
    fixture.detectChanges();

    expect(itemServiceSpy.getAll).toHaveBeenCalledTimes(1);
    expect(component.isLoading()).toBeFalse();
    expect(component.itensData().length).toBe(3);

    const [integral, parcial, esgotado] = component.itensData();
    expect(integral.statusEstoque).toBe('integral');
    expect(integral.dataChegadaFormatada).toBe('15/05/2026');
    expect(integral.doadorNome).toBe('Maria Silva');

    expect(parcial.statusEstoque).toBe('parcial');
    expect(parcial.doadorNome).toBe('Não informado');

    expect(esgotado.statusEstoque).toBe('esgotado');
  });

  it('should return empty string when formatarDataBr receives empty input', () => {
    expect(component.formatarDataBr('')).toBe('');
  });

  it('should load dynamic dropdown filters for status, campaigns and donors', () => {
    fixture.detectChanges();

    expect(campanhaServiceSpy.getAll).toHaveBeenCalledTimes(1);
    expect(doadorServiceSpy.getAll).toHaveBeenCalledTimes(1);
    expect(component.isFiltersLoading()).toBeFalse();

    const filters = component.dynamicFilters();
    expect(filters.length).toBe(3);
    expect(filters[0].field).toBe('statusEstoque');
    expect(filters[1].field).toBe('campanhaId');
    expect(filters[1].options).toContain({ label: 'Campanha do Agasalho', value: 'camp-1' });
    expect(filters[2].field).toBe('doadorId');
    expect(filters[2].options).toContain({ label: 'Maria Silva', value: 'doador-1' });
  });

  it('should handle error when loading items fails', () => {
    itemServiceSpy.getAll.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    fixture.detectChanges();

    expect(component.itensData()).toEqual([]);
    expect(component.isLoading()).toBeFalse();
  });

  it('should evaluate cardActions visibility based on quantity and donation history', () => {
    fixture.detectChanges();
    const [integral, parcial, esgotado] = component.itensData();
    const actions = component.cardActions();

    const donateAction = actions.find(a => a.actionId === 'donate')!;
    const historyAction = actions.find(a => a.actionId === 'history')!;
    const editAction = actions.find(a => a.actionId === 'edit')!;
    const deleteAction = actions.find(a => a.actionId === 'delete')!;

    expect(donateAction.visibleFn!(integral)).toBeTrue();
    expect(donateAction.visibleFn!(esgotado)).toBeFalse();

    expect(historyAction.visibleFn!(integral)).toBeFalse();
    expect(historyAction.visibleFn!(parcial)).toBeTrue();

    expect(editAction.visibleFn!(esgotado)).toBeTrue();
    expect(deleteAction.visibleFn!(esgotado)).toBeTrue();
  });

  it('should open and close item modal on create new', () => {
    fixture.detectChanges();

    component.onCreateNew();
    fixture.detectChanges();

    expect(component.itemSelecionado()).toBeNull();
    expect(component.isModalOpen()).toBeTrue();
    expect(fixture.nativeElement.querySelector('app-item-form')).not.toBeNull();

    component.fecharModal();
    fixture.detectChanges();

    expect(component.isModalOpen()).toBeFalse();
    expect(fixture.nativeElement.querySelector('app-item-form')).toBeNull();
  });

  it('should handle edit, donate and history card actions and close their modals', () => {
    fixture.detectChanges();
    const target = component.itensData()[1];

    component.handleCardAction({ action: 'edit', data: target });
    expect(component.itemSelecionado()).toEqual(target);
    expect(component.isModalOpen()).toBeTrue();
    component.fecharModal();
    expect(component.isModalOpen()).toBeFalse();

    component.handleCardAction({ action: 'donate', data: target });
    fixture.detectChanges();
    expect(component.itemSelecionado()).toEqual(target);
    expect(component.isDoacaoModalOpen()).toBeTrue();
    expect(fixture.nativeElement.querySelector('app-doacao-form')).not.toBeNull();
    component.fecharDoacaoModal();
    expect(component.isDoacaoModalOpen()).toBeFalse();

    component.handleCardAction({ action: 'history', data: target });
    fixture.detectChanges();
    expect(component.itemSelecionado()).toEqual(target);
    expect(component.isHistoricoModalOpen()).toBeTrue();
    expect(fixture.nativeElement.querySelector('app-historico-doacoes-modal')).not.toBeNull();
    component.fecharHistoricoModal();
    expect(component.isHistoricoModalOpen()).toBeFalse();
  });

  it('should delete item when delete action is confirmed', () => {
    fixture.detectChanges();
    const target = component.itensData()[0];
    confirmationServiceSpy.open.and.returnValue(of(true));
    itemServiceSpy.delete.and.returnValue(of(void 0));

    component.handleCardAction({ action: 'delete', data: target });

    expect(confirmationServiceSpy.open).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Excluir Item',
        subtitle: `Você está prestes a excluir ${target.nome}.`
      })
    );
    expect(itemServiceSpy.delete).toHaveBeenCalledWith(target.id);
    expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Item excluído com sucesso.');
    expect(itemServiceSpy.getAll).toHaveBeenCalledTimes(2);
  });

  it('should not delete item when confirmation is cancelled', () => {
    fixture.detectChanges();
    const target = component.itensData()[0];
    confirmationServiceSpy.open.and.returnValue(of(false));

    component.handleCardAction({ action: 'delete', data: target });

    expect(itemServiceSpy.delete).not.toHaveBeenCalled();
  });

  it('should show error toast when deleting item fails', () => {
    fixture.detectChanges();
    const target = component.itensData()[0];
    confirmationServiceSpy.open.and.returnValue(of(true));
    itemServiceSpy.delete.and.returnValue(
      throwError(() => new HttpErrorResponse({ error: { erro: 'Falha ao remover item.' }, status: 400 }))
    );

    component.handleCardAction({ action: 'delete', data: target });

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Falha ao remover item.');
  });

  it('should create an item normalizing empty optional fields and reload list', () => {
    fixture.detectChanges();
    itemServiceSpy.create.and.returnValue(of(mockItens[0]));
    component.isModalOpen.set(true);

    component.salvarItem({
      id: null,
      nome: 'Agasalho Infantil',
      quantidade: 4,
      dataChegada: '2026-05-20',
      campanhaId: 'camp-1',
      descricao: '',
      lugarPego: '',
      horaPego: ''
    });

    expect(itemServiceSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        nome: 'Agasalho Infantil',
        descricao: null,
        lugarPego: null,
        horaPego: null
      })
    );
    expect(component.isModalOpen()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Item cadastrado com sucesso!');
    expect(itemServiceSpy.getAll).toHaveBeenCalledTimes(2);
  });

  it('should show fallback error toast when creating item fails', () => {
    fixture.detectChanges();
    itemServiceSpy.create.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    component.salvarItem({
      nome: 'Item Erro',
      quantidade: 1,
      dataChegada: '2026-05-20',
      campanhaId: 'camp-1',
      descricao: '',
      lugarPego: '',
      horaPego: ''
    });

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Erro ao cadastrar item.');
  });

  it('should update an existing item and reload list', () => {
    fixture.detectChanges();
    itemServiceSpy.update.and.returnValue(of(void 0));
    component.isModalOpen.set(true);

    component.salvarItem({
      id: 'item-1',
      nome: 'Casaco Editado',
      quantidade: 6,
      dataChegada: '2026-05-15',
      campanhaId: 'camp-1',
      descricao: 'Lã azul',
      lugarPego: 'Sede',
      horaPego: '10:00'
    });

    expect(itemServiceSpy.update).toHaveBeenCalledWith(
      'item-1',
      jasmine.objectContaining({
        id: 'item-1',
        nome: 'Casaco Editado',
        descricao: 'Lã azul',
        lugarPego: 'Sede',
        horaPego: '10:00'
      })
    );
    expect(component.isModalOpen()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Item atualizado com sucesso!');
    expect(itemServiceSpy.getAll).toHaveBeenCalledTimes(2);
  });

  it('should show API error message when updating item fails', () => {
    fixture.detectChanges();
    itemServiceSpy.update.and.returnValue(
      throwError(() => new HttpErrorResponse({ error: { erro: 'Quantidade inválida.' }, status: 400 }))
    );

    component.salvarItem({
      id: 'item-1',
      nome: 'Casaco Editado',
      quantidade: -1,
      dataChegada: '2026-05-15',
      campanhaId: 'camp-1'
    });

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Quantidade inválida.');
  });

  it('should register donation for selected item and reload list', () => {
    fixture.detectChanges();
    const target = component.itensData()[0];
    component.itemSelecionado.set(target);
    component.isDoacaoModalOpen.set(true);
    itemServiceSpy.registrarDoacao.and.returnValue(of(void 0));

    component.salvarDoacao({
      quantidade: 2,
      dataDoacao: '2026-05-21',
      destino: 'Abrigo Central'
    });

    expect(itemServiceSpy.registrarDoacao).toHaveBeenCalledWith({
      itemId: 'item-1',
      quantidade: 2,
      dataDoacao: '2026-05-21',
      destino: 'Abrigo Central'
    });
    expect(component.isDoacaoModalOpen()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Doação registrada com sucesso!');
    expect(itemServiceSpy.getAll).toHaveBeenCalledTimes(2);
  });

  it('should show error toast when registering donation fails', () => {
    fixture.detectChanges();
    const target = component.itensData()[0];
    component.itemSelecionado.set(target);
    itemServiceSpy.registrarDoacao.and.returnValue(
      throwError(() => new HttpErrorResponse({ error: { erro: 'Estoque insuficiente.' }, status: 400 }))
    );

    component.salvarDoacao({
      quantidade: 99,
      dataDoacao: '2026-05-21',
      destino: 'Abrigo Central'
    });

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Estoque insuficiente.');
  });
});
