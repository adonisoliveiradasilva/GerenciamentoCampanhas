import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';

import { Doadores } from './doadores';
import { DoadorService, IDoadorVM } from '../../domains/doador/services/doador.service';
import { ToastService } from '../../domains/toast/services/toast-service';
import { ConfirmationModalService } from '../../domains/confirmation-modal/services/confirmation-modal';

describe('Doadores', () => {
  let component: Doadores;
  let fixture: ComponentFixture<Doadores>;
  let doadorServiceSpy: jasmine.SpyObj<DoadorService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let confirmationServiceSpy: jasmine.SpyObj<ConfirmationModalService>;

  const birthYear = new Date().getFullYear() - 30;
  const mockDoadores: IDoadorVM[] = [
    {
      id: 'doador-1',
      nome: 'Ana Paula',
      email: 'ana@email.com',
      dataNascimento: `${birthYear}-01-01T12:00:00Z`
    },
    {
      id: 'doador-2',
      nome: 'Carlos Lima',
      email: 'carlos@email.com',
      dataNascimento: ''
    }
  ];

  beforeEach(async () => {
    doadorServiceSpy = jasmine.createSpyObj<DoadorService>('DoadorService', [
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

    doadorServiceSpy.getAll.and.returnValue(of(mockDoadores));

    await TestBed.configureTestingModule({
      imports: [Doadores],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync('noop'),
        { provide: DoadorService, useValue: doadorServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ConfirmationModalService, useValue: confirmationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Doadores);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load donors on init and compute age and formatted birth date', () => {
    fixture.detectChanges();

    expect(doadorServiceSpy.getAll).toHaveBeenCalledTimes(1);
    expect(component.isLoading()).toBeFalse();
    expect(component.doadoresData().length).toBe(2);

    const first = component.doadoresData()[0] as IDoadorVM & { idade: number };
    const second = component.doadoresData()[1] as IDoadorVM & { idade: number };

    expect(first.idade).toBe(30);
    expect(first.dataNascimentoFormatada).toBe(`01/01/${birthYear}`);
    expect(second.idade).toBe(0);
    expect(second.dataNascimentoFormatada).toBe('');
  });

  it('should expose expected search fields, columns and row actions', () => {
    fixture.detectChanges();

    expect(component.searchFields()).toEqual(['nome', 'idade', 'email']);
    expect(component.tableColumns().map(c => c.field)).toEqual([
      'nome',
      'email',
      'idade',
      'dataNascimentoFormatada'
    ]);

    const actions = component.tableActions();
    expect(actions.map(a => a.actionId)).toEqual(['edit', 'delete']);
    expect(actions.every(a => a.visibleFn?.(mockDoadores[0]) === true)).toBeTrue();
  });

  it('should handle error when loading donors fails', () => {
    spyOn(console, 'error');
    doadorServiceSpy.getAll.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    fixture.detectChanges();

    expect(component.doadoresData()).toEqual([]);
    expect(component.isLoading()).toBeFalse();
  });

  it('should open and close donor modal on create new', () => {
    fixture.detectChanges();

    component.onCreateNew();
    fixture.detectChanges();

    expect(component.doadorSelecionado()).toBeNull();
    expect(component.isModalOpen()).toBeTrue();
    expect(fixture.nativeElement.querySelector('app-doador-form')).not.toBeNull();

    component.fecharModal();
    fixture.detectChanges();

    expect(component.isModalOpen()).toBeFalse();
    expect(fixture.nativeElement.querySelector('app-doador-form')).toBeNull();
  });

  it('should select donor and open modal on edit row action', () => {
    fixture.detectChanges();
    const target = component.doadoresData()[0];

    component.handleRowAction({ action: 'edit', data: target });

    expect(component.doadorSelecionado()).toEqual(target);
    expect(component.isModalOpen()).toBeTrue();
  });

  it('should delete donor when confirmation is accepted', () => {
    fixture.detectChanges();
    const target = component.doadoresData()[0];
    confirmationServiceSpy.open.and.returnValue(of(true));
    doadorServiceSpy.delete.and.returnValue(of(void 0));

    component.handleRowAction({ action: 'delete', data: target });

    expect(confirmationServiceSpy.open).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Excluir Doador',
        subtitle: `Você está prestes a excluir ${target.nome}.`,
        type: 'danger'
      })
    );
    expect(doadorServiceSpy.delete).toHaveBeenCalledWith(target.id);
    expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Doador excluído com sucesso.');
    expect(doadorServiceSpy.getAll).toHaveBeenCalledTimes(2);
  });

  it('should not delete donor when confirmation is declined', () => {
    fixture.detectChanges();
    const target = component.doadoresData()[0];
    confirmationServiceSpy.open.and.returnValue(of(false));

    component.handleRowAction({ action: 'delete', data: target });

    expect(doadorServiceSpy.delete).not.toHaveBeenCalled();
  });

  it('should show error toast when deleting donor fails', () => {
    fixture.detectChanges();
    const target = component.doadoresData()[0];
    confirmationServiceSpy.open.and.returnValue(of(true));
    doadorServiceSpy.delete.and.returnValue(
      throwError(() => new HttpErrorResponse({ error: { erro: 'Doador vinculado a itens.' }, status: 400 }))
    );

    component.handleRowAction({ action: 'delete', data: target });

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Doador vinculado a itens.');
  });

  it('should create a new donor and reload list', () => {
    fixture.detectChanges();
    doadorServiceSpy.create.and.returnValue(of(mockDoadores[0]));
    component.isModalOpen.set(true);

    const payload = { nome: 'Novo Doador', email: 'novo@email.com', dataNascimento: '1995-04-10' };
    component.salvarDoador(payload);

    expect(doadorServiceSpy.create).toHaveBeenCalledWith(payload);
    expect(component.isModalOpen()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Doador criado com sucesso!');
    expect(doadorServiceSpy.getAll).toHaveBeenCalledTimes(2);
  });

  it('should show error toast when creating donor fails', () => {
    fixture.detectChanges();
    doadorServiceSpy.create.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    component.salvarDoador({ nome: 'Erro', email: 'erro@email.com', dataNascimento: '1995-04-10' });

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Erro ao criar doador.');
  });

  it('should update an existing donor and reload list', () => {
    fixture.detectChanges();
    doadorServiceSpy.update.and.returnValue(of(void 0));
    component.isModalOpen.set(true);

    const payload = {
      id: 'doador-1',
      nome: 'Ana Paula Editada',
      email: 'ana@email.com',
      dataNascimento: '1996-01-01'
    };
    component.salvarDoador(payload);

    expect(doadorServiceSpy.update).toHaveBeenCalledWith('doador-1', payload);
    expect(component.isModalOpen()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Doador atualizado com sucesso!');
    expect(doadorServiceSpy.getAll).toHaveBeenCalledTimes(2);
  });

  it('should show API error message when updating donor fails', () => {
    fixture.detectChanges();
    doadorServiceSpy.update.and.returnValue(
      throwError(() => new HttpErrorResponse({ error: { erro: 'E-mail já cadastrado.' }, status: 400 }))
    );

    component.salvarDoador({
      id: 'doador-1',
      nome: 'Ana',
      email: 'duplicado@email.com',
      dataNascimento: '1996-01-01'
    });

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'E-mail já cadastrado.');
  });
});
