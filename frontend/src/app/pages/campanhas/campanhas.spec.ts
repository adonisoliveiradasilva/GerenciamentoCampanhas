import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';

import { Campanhas } from './campanhas';
import { CampanhaService, ICampanhaVM } from '../../domains/campanha/services/campanha.service';
import { ToastService } from '../../domains/toast/services/toast-service';
import { ConfirmationModalService } from '../../domains/confirmation-modal/services/confirmation-modal';

describe('Campanhas', () => {
  let component: Campanhas;
  let fixture: ComponentFixture<Campanhas>;
  let campanhaServiceSpy: jasmine.SpyObj<CampanhaService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let confirmationServiceSpy: jasmine.SpyObj<ConfirmationModalService>;

  const mockCampanhas: ICampanhaVM[] = [
    {
      id: 'camp-1',
      nome: 'Campanha do Agasalho',
      local: 'Igreja Central',
      descricao: 'Arrecadação de roupas de inverno',
      dataInicio: '2026-05-15T12:00:00Z',
      dataFim: '2026-06-20T12:00:00Z'
    },
    {
      id: 'camp-2',
      nome: 'Natal Solidário',
      local: 'Salão Comunitário',
      descricao: '',
      dataInicio: '2026-11-10T12:00:00Z',
      dataFim: ''
    }
  ];

  beforeEach(async () => {
    campanhaServiceSpy = jasmine.createSpyObj<CampanhaService>('CampanhaService', [
      'getAll',
      'create',
      'update',
      'delete'
    ]);
    toastServiceSpy = jasmine.createSpyObj<ToastService>('ToastService', ['show', 'remove']);
    confirmationServiceSpy = jasmine.createSpyObj<ConfirmationModalService>(
      'ConfirmationModalService',
      ['open', 'close']
    );

    campanhaServiceSpy.getAll.and.returnValue(of(mockCampanhas));

    await TestBed.configureTestingModule({
      imports: [Campanhas],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync('noop'),
        { provide: CampanhaService, useValue: campanhaServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ConfirmationModalService, useValue: confirmationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Campanhas);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load and map campaigns on init', () => {
    fixture.detectChanges();

    expect(campanhaServiceSpy.getAll).toHaveBeenCalledTimes(1);
    expect(component.isLoading()).toBeFalse();
    expect(component.campanhasData().length).toBe(2);

    const [first, second] = component.campanhasData();
    expect(first.anoLabel).toBe('2026');
    expect(first.anoCss).toBe('purple');
    expect(first.dataInicioFormatada).toBe('15/05/2026');
    expect(first.dataFimFormatada).toBe('20/06/2026');
    expect(second.dataFimFormatada).toBe('');
  });

  it('should expose expected search fields, columns and row actions', () => {
    fixture.detectChanges();

    expect(component.searchFields()).toEqual(['nome', 'local', 'anoLabel']);
    expect(component.tableColumns().map(c => c.field)).toEqual([
      'nome',
      'anoLabel',
      'dataInicioFormatada',
      'dataFimFormatada'
    ]);

    const actions = component.tableActions();
    expect(actions.map(a => a.actionId)).toEqual(['edit', 'delete']);
    expect(actions.every(a => a.visibleFn?.(mockCampanhas[0]) === true)).toBeTrue();
  });

  it('should handle error when loading campaigns fails', () => {
    spyOn(console, 'error');
    campanhaServiceSpy.getAll.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    fixture.detectChanges();

    expect(component.campanhasData()).toEqual([]);
    expect(component.isLoading()).toBeFalse();
  });

  it('should open create modal with null selection and close it', () => {
    fixture.detectChanges();

    component.onCreateNew();
    fixture.detectChanges();

    expect(component.campanhaSelecionada()).toBeNull();
    expect(component.isModalOpen()).toBeTrue();
    expect(fixture.nativeElement.querySelector('app-campanha-form')).not.toBeNull();

    component.fecharModal();
    fixture.detectChanges();

    expect(component.isModalOpen()).toBeFalse();
    expect(fixture.nativeElement.querySelector('app-campanha-form')).toBeNull();
  });

  it('should open edit modal when edit row action is triggered', () => {
    fixture.detectChanges();
    const target = component.campanhasData()[0];

    component.handleRowAction({ action: 'edit', data: target });

    expect(component.campanhaSelecionada()).toEqual(target);
    expect(component.isModalOpen()).toBeTrue();
  });

  it('should delete campaign when delete action is confirmed', () => {
    fixture.detectChanges();
    const target = component.campanhasData()[0];
    confirmationServiceSpy.open.and.returnValue(of(true));
    campanhaServiceSpy.delete.and.returnValue(of(void 0));

    component.handleRowAction({ action: 'delete', data: target });

    expect(confirmationServiceSpy.open).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Excluir Campanha',
        subtitle: `Você está prestes a excluir a campanha ${target.nome}.`,
        type: 'danger'
      })
    );
    expect(campanhaServiceSpy.delete).toHaveBeenCalledWith(target.id);
    expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Campanha excluída com sucesso.');
    expect(campanhaServiceSpy.getAll).toHaveBeenCalledTimes(2);
  });

  it('should not delete campaign when confirmation is cancelled', () => {
    fixture.detectChanges();
    const target = component.campanhasData()[0];
    confirmationServiceSpy.open.and.returnValue(of(false));

    component.handleRowAction({ action: 'delete', data: target });

    expect(campanhaServiceSpy.delete).not.toHaveBeenCalled();
  });

  it('should show error toast when deleting campaign fails', () => {
    fixture.detectChanges();
    const target = component.campanhasData()[0];
    confirmationServiceSpy.open.and.returnValue(of(true));
    campanhaServiceSpy.delete.and.returnValue(
      throwError(
        () => new HttpErrorResponse({ error: { erro: 'Campanha possui itens vinculados.' }, status: 400 })
      )
    );

    component.handleRowAction({ action: 'delete', data: target });

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Campanha possui itens vinculados.');
  });

  it('should show fallback error toast when deleting campaign fails without backend message', () => {
    fixture.detectChanges();
    const target = component.campanhasData()[0];
    confirmationServiceSpy.open.and.returnValue(of(true));
    campanhaServiceSpy.delete.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    component.handleRowAction({ action: 'delete', data: target });

    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Erro ao excluir campanha.');
  });

  it('should create a campaign, normalize optional fields and reload list', () => {
    fixture.detectChanges();
    campanhaServiceSpy.create.and.returnValue(of(mockCampanhas[0]));
    component.isModalOpen.set(true);

    component.salvarCampanha({
      id: null,
      nome: 'Nova Campanha',
      local: 'Sede',
      dataInicio: '2026-07-01',
      dataFim: '',
      descricao: ''
    });

    expect(campanhaServiceSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        nome: 'Nova Campanha',
        local: 'Sede',
        dataFim: null,
        descricao: null
      })
    );
    expect(component.isModalOpen()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Campanha criada com sucesso!');
    expect(campanhaServiceSpy.getAll).toHaveBeenCalledTimes(2);
  });

  it('should show error toast when creating campaign fails', () => {
    fixture.detectChanges();
    campanhaServiceSpy.create.and.returnValue(
      throwError(() => new HttpErrorResponse({ error: { erro: 'Nome duplicado.' }, status: 400 }))
    );

    component.salvarCampanha({
      nome: 'Campanha Duplicada',
      local: 'Sede',
      dataInicio: '2026-07-01',
      dataFim: '2026-08-01',
      descricao: 'Detalhes'
    });

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Nome duplicado.');
  });

  it('should update an existing campaign and reload list', () => {
    fixture.detectChanges();
    campanhaServiceSpy.update.and.returnValue(of(void 0));
    component.isModalOpen.set(true);

    component.salvarCampanha({
      id: 'camp-1',
      nome: 'Campanha Editada',
      local: 'Igreja',
      dataInicio: '2026-05-15',
      dataFim: '2026-06-30',
      descricao: 'Atualizada'
    });

    expect(campanhaServiceSpy.update).toHaveBeenCalledWith(
      'camp-1',
      jasmine.objectContaining({
        id: 'camp-1',
        nome: 'Campanha Editada',
        dataFim: '2026-06-30',
        descricao: 'Atualizada'
      })
    );
    expect(component.isModalOpen()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Campanha atualizada com sucesso!');
    expect(campanhaServiceSpy.getAll).toHaveBeenCalledTimes(2);
  });

  it('should show fallback error toast when updating campaign fails', () => {
    fixture.detectChanges();
    campanhaServiceSpy.update.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    component.salvarCampanha({
      id: 'camp-1',
      nome: 'Campanha Editada',
      local: 'Igreja',
      dataInicio: '2026-05-15',
      dataFim: '',
      descricao: ''
    });

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Erro ao editar campanha.');
  });
});
