import { provideZonelessChangeDetection, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';

import { IUsuarioVM, Usuarios } from './usuarios';
import {
  IUserResponse,
  IUsuarioVM as IUsuarioApiVM,
  UserService
} from '../../domains/user/services/user.service';
import { ToastService } from '../../domains/toast/services/toast-service';
import { ConfirmationModalService } from '../../domains/confirmation-modal/services/confirmation-modal';

describe('Usuarios', () => {
  let component: Usuarios;
  let fixture: ComponentFixture<Usuarios>;
  let currentUserSignal: WritableSignal<IUserResponse | null>;
  let userServiceMock: jasmine.SpyObj<UserService> & {
    currentUser: WritableSignal<IUserResponse | null>;
  };
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let confirmationServiceSpy: jasmine.SpyObj<ConfirmationModalService>;

  const mockLoggedUser: IUserResponse = {
    id: 'user-1',
    name: 'Admin Principal',
    email: 'admin@igreja.com',
    role: 'Administrador'
  };

  const mockApiUsers: IUsuarioApiVM[] = [
    {
      id: 'user-1',
      nome: 'Admin Principal',
      email: 'admin@igreja.com',
      perfil: 'Administrador',
      dataCriacao: new Date('2026-01-10T12:00:00Z'),
      ativo: true
    },
    {
      id: 'user-2',
      nome: 'Diácono Pedro',
      email: 'pedro@igreja.com',
      perfil: 'Diacono',
      dataCriacao: new Date('2026-02-15T12:00:00Z'),
      ativo: false
    }
  ];

  beforeEach(async () => {
    currentUserSignal = signal<IUserResponse | null>(mockLoggedUser);
    const spy = jasmine.createSpyObj<UserService>('UserService', [
      'getAll',
      'create',
      'update',
      'delete'
    ]);
    userServiceMock = Object.assign(spy, { currentUser: currentUserSignal });
    toastServiceSpy = jasmine.createSpyObj<ToastService>('ToastService', ['show', 'remove']);
    confirmationServiceSpy = jasmine.createSpyObj<ConfirmationModalService>(
      'ConfirmationModalService',
      ['open', 'close']
    );

    userServiceMock.getAll.and.returnValue(of(mockApiUsers));

    await TestBed.configureTestingModule({
      imports: [Usuarios],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync('noop'),
        { provide: UserService, useValue: userServiceMock },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ConfirmationModalService, useValue: confirmationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Usuarios);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load users on init and map active and inactive statuses', () => {
    fixture.detectChanges();

    expect(userServiceMock.getAll).toHaveBeenCalledTimes(1);
    expect(component.isLoading()).toBeFalse();
    expect(component.usuariosData().length).toBe(2);

    const [activeUser, inactiveUser] = component.usuariosData();
    expect(activeUser.status).toBe('ativo');
    expect(activeUser.statusLabel).toBe('Ativo');
    expect(activeUser.statusCss).toBe('success');
    expect(activeUser.statusIcon).toBe('fa-solid fa-check-circle');

    expect(inactiveUser.status).toBe('inativo');
    expect(inactiveUser.statusLabel).toBe('Inativo');
    expect(inactiveUser.statusCss).toBe('danger');
    expect(inactiveUser.statusIcon).toBe('fa-solid fa-ban');
  });

  it('should handle error when loading users fails', () => {
    spyOn(console, 'error');
    userServiceMock.getAll.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    fixture.detectChanges();

    expect(component.usuariosData()).toEqual([]);
    expect(component.isLoading()).toBeFalse();
  });

  it('should hide edit and delete actions for the logged-in user and show them for others', () => {
    fixture.detectChanges();
    const [loggedRow, otherRow] = component.usuariosData();
    const actions = component.tableActions();

    const editAction = actions.find(a => a.actionId === 'edit')!;
    const deleteAction = actions.find(a => a.actionId === 'delete')!;

    expect(editAction.visibleFn!(loggedRow)).toBeFalse();
    expect(deleteAction.visibleFn!(loggedRow)).toBeFalse();

    expect(editAction.visibleFn!(otherRow)).toBeTrue();
    expect(deleteAction.visibleFn!(otherRow)).toBeTrue();
  });

  it('should open and close user modal on create new', () => {
    fixture.detectChanges();

    component.onCreateNew();
    fixture.detectChanges();

    expect(component.usuarioSelecionado()).toBeNull();
    expect(component.isModalOpen()).toBeTrue();
    expect(fixture.nativeElement.querySelector('app-usuario-form')).not.toBeNull();

    component.fecharModal();
    fixture.detectChanges();

    expect(component.isModalOpen()).toBeFalse();
    expect(fixture.nativeElement.querySelector('app-usuario-form')).toBeNull();
  });

  it('should select user and open modal on edit row action', () => {
    fixture.detectChanges();
    const target: IUsuarioVM = component.usuariosData()[1];

    component.handleRowAction({ action: 'edit', data: target });

    expect(component.usuarioSelecionado()).toEqual(target);
    expect(component.isModalOpen()).toBeTrue();
  });

  it('should delete user when delete confirmation is accepted', () => {
    fixture.detectChanges();
    const target = component.usuariosData()[1];
    confirmationServiceSpy.open.and.returnValue(of(true));
    userServiceMock.delete.and.returnValue(of(void 0));

    component.handleRowAction({ action: 'delete', data: target });

    expect(confirmationServiceSpy.open).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Excluir Usuário',
        subtitle: `Você está prestes a excluir ${target.nome}.`,
        type: 'danger'
      })
    );
    expect(userServiceMock.delete).toHaveBeenCalledWith(target.id);
    expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Usuário excluído com sucesso.');
    expect(userServiceMock.getAll).toHaveBeenCalledTimes(2);
  });

  it('should not delete user when confirmation is cancelled', () => {
    fixture.detectChanges();
    const target = component.usuariosData()[1];
    confirmationServiceSpy.open.and.returnValue(of(false));

    component.handleRowAction({ action: 'delete', data: target });

    expect(userServiceMock.delete).not.toHaveBeenCalled();
  });

  it('should show error toast when deleting user fails', () => {
    fixture.detectChanges();
    const target = component.usuariosData()[1];
    confirmationServiceSpy.open.and.returnValue(of(true));
    userServiceMock.delete.and.returnValue(
      throwError(() => new HttpErrorResponse({ error: { erro: 'Não é possível excluir.' }, status: 400 }))
    );

    component.handleRowAction({ action: 'delete', data: target });

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Não é possível excluir.');
  });

  it('should create a user converting status string to ativo boolean and reload list', () => {
    fixture.detectChanges();
    userServiceMock.create.and.returnValue(of(mockApiUsers[1]));
    component.isModalOpen.set(true);

    component.salvarUsuario({
      id: null,
      nome: 'Novo Usuário',
      email: 'novo@igreja.com',
      perfil: 'Diacono',
      status: 'ativo'
    });

    expect(userServiceMock.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        nome: 'Novo Usuário',
        email: 'novo@igreja.com',
        ativo: true
      })
    );
    expect(component.isModalOpen()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Usuário criado com sucesso!');
    expect(userServiceMock.getAll).toHaveBeenCalledTimes(2);
  });

  it('should show fallback error toast when creating user fails', () => {
    fixture.detectChanges();
    userServiceMock.create.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    component.salvarUsuario({
      nome: 'Erro',
      email: 'erro@igreja.com',
      perfil: 'Diacono',
      status: 'ativo'
    });

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Erro ao criar usuário.');
  });

  it('should update an existing user mapping inactive status to ativo false', () => {
    fixture.detectChanges();
    userServiceMock.update.and.returnValue(of(void 0));
    component.isModalOpen.set(true);

    component.salvarUsuario({
      id: 'user-2',
      nome: 'Diácono Pedro Editado',
      email: 'pedro@igreja.com',
      perfil: 'Diacono',
      status: 'inativo'
    });

    expect(userServiceMock.update).toHaveBeenCalledWith(
      'user-2',
      jasmine.objectContaining({
        id: 'user-2',
        nome: 'Diácono Pedro Editado',
        ativo: false
      })
    );
    expect(component.isModalOpen()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Usuário atualizado com sucesso!');
    expect(userServiceMock.getAll).toHaveBeenCalledTimes(2);
  });

  it('should show API error message when updating user fails', () => {
    fixture.detectChanges();
    userServiceMock.update.and.returnValue(
      throwError(() => new HttpErrorResponse({ error: { erro: 'Perfil inválido.' }, status: 400 }))
    );

    component.salvarUsuario({
      id: 'user-2',
      nome: 'Pedro',
      email: 'pedro@igreja.com',
      perfil: 'Invalido',
      status: 'ativo'
    });

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Perfil inválido.');
  });
});
