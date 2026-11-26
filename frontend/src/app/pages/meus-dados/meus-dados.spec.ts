import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { MeusDados } from './meus-dados';
import { IUserResponse, UserService } from '../../domains/user/services/user.service';
import { ToastService } from '../../domains/toast/services/toast-service';

describe('MeusDados', () => {
  let component: MeusDados;
  let fixture: ComponentFixture<MeusDados>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const mockLoggedUser: IUserResponse = {
    id: 'user-1',
    name: 'João Gestor',
    email: 'joao@igreja.com',
    role: 'Administrador'
  };

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj<UserService>('UserService', [
      'getLoggedUser',
      'updateMeusDados',
      'updateUserNameLocal',
      'alterarSenha'
    ]);
    toastServiceSpy = jasmine.createSpyObj<ToastService>('ToastService', ['show', 'remove']);

    userServiceSpy.getLoggedUser.and.returnValue(mockLoggedUser);

    await TestBed.configureTestingModule({
      imports: [MeusDados],
      providers: [
        provideZonelessChangeDetection(),
        { provide: UserService, useValue: userServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MeusDados);
    component = fixture.componentInstance;
  });

  it('should create and initialize forms with logged user data', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.dadosForm.get('nome')?.value).toBe('João Gestor');
    expect(component.dadosForm.get('email')?.value).toBe('joao@igreja.com');
    expect(component.dadosForm.get('email')?.disabled).toBeTrue();
    expect(component.senhaForm.get('senhaAtual')?.value).toBe('');
    expect(component.isLoading()).toBeFalse();
  });

  it('should initialize empty fields when no logged user is available', () => {
    userServiceSpy.getLoggedUser.and.returnValue(null);

    fixture.detectChanges();

    expect(component.dadosForm.get('nome')?.value).toBe('');
    expect(component.dadosForm.get('email')?.value).toBe('');
  });

  it('should evaluate password strength and confirmation criteria getters', () => {
    fixture.detectChanges();

    component.senhaForm.patchValue({
      novaSenha: 'abc',
      confirmarSenha: 'abc'
    });
    expect(component.temMinLength).toBeFalse();
    expect(component.temMaiuscula).toBeFalse();
    expect(component.temNumero).toBeFalse();
    expect(component.temEspecial).toBeFalse();
    expect(component.senhasConferem).toBeTrue();

    component.senhaForm.patchValue({
      novaSenha: 'Senha@123',
      confirmarSenha: 'Outra@123'
    });
    expect(component.temMinLength).toBeTrue();
    expect(component.temMaiuscula).toBeTrue();
    expect(component.temNumero).toBeTrue();
    expect(component.temEspecial).toBeTrue();
    expect(component.senhasConferem).toBeFalse();

    component.senhaForm.patchValue({ confirmarSenha: 'Senha@123' });
    expect(component.senhasConferem).toBeTrue();
  });

  it('should not submit dadosForm when invalid and mark controls touched', () => {
    fixture.detectChanges();
    component.dadosForm.patchValue({ nome: 'Ab' });

    component.salvarDados();

    expect(component.dadosForm.get('nome')?.touched).toBeTrue();
    expect(userServiceSpy.updateMeusDados).not.toHaveBeenCalled();
  });

  it('should update user profile data and local name on success', () => {
    fixture.detectChanges();
    userServiceSpy.updateMeusDados.and.returnValue(of(void 0));
    component.dadosForm.patchValue({ nome: 'João Silva Atualizado' });

    component.salvarDados();

    expect(userServiceSpy.updateMeusDados).toHaveBeenCalledWith({
      nome: 'João Silva Atualizado'
    });
    expect(userServiceSpy.updateUserNameLocal).toHaveBeenCalledWith('João Silva Atualizado');
    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Dados atualizados com sucesso!');
  });

  it('should show error toast when updating profile data fails', () => {
    fixture.detectChanges();
    userServiceSpy.updateMeusDados.and.returnValue(
      throwError(() => new HttpErrorResponse({ error: { erro: 'Nome inválido.' }, status: 400 }))
    );

    component.salvarDados();

    expect(component.isLoading()).toBeFalse();
    expect(userServiceSpy.updateUserNameLocal).not.toHaveBeenCalled();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Nome inválido.');
  });

  it('should show fallback error toast when updating profile data fails without custom message', () => {
    fixture.detectChanges();
    userServiceSpy.updateMeusDados.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );

    component.salvarDados();

    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Erro ao atualizar dados.');
  });

  it('should warn and skip password change when form is invalid or passwords do not match', () => {
    fixture.detectChanges();
    component.senhaForm.patchValue({
      senhaAtual: 'Antiga@1',
      novaSenha: 'NovaSenha@1',
      confirmarSenha: 'Diferente@1'
    });

    component.alterarSenha();

    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'warning',
      'Verifique os critérios da nova senha.'
    );
    expect(userServiceSpy.alterarSenha).not.toHaveBeenCalled();
  });

  it('should update password, reset form and show success toast', () => {
    fixture.detectChanges();
    userServiceSpy.alterarSenha.and.returnValue(of(void 0));
    component.senhaForm.patchValue({
      senhaAtual: 'Antiga@123',
      novaSenha: 'NovaSenha@123',
      confirmarSenha: 'NovaSenha@123'
    });

    component.alterarSenha();

    expect(userServiceSpy.alterarSenha).toHaveBeenCalledWith({
      senhaAtual: 'Antiga@123',
      novaSenha: 'NovaSenha@123'
    });
    expect(component.isLoading()).toBeFalse();
    expect(component.senhaForm.get('senhaAtual')?.value).toBeNull();
    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'success',
      'Sua senha foi alterada com segurança!'
    );
  });

  it('should show error toast when changing password fails', () => {
    fixture.detectChanges();
    userServiceSpy.alterarSenha.and.returnValue(
      throwError(() => new HttpErrorResponse({ error: { erro: 'Senha atual incorreta.' }, status: 400 }))
    );
    component.senhaForm.patchValue({
      senhaAtual: 'Errada@123',
      novaSenha: 'NovaSenha@123',
      confirmarSenha: 'NovaSenha@123'
    });

    component.alterarSenha();

    expect(component.isLoading()).toBeFalse();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Senha atual incorreta.');
  });

  it('should show fallback error toast when changing password fails without backend message', () => {
    fixture.detectChanges();
    userServiceSpy.alterarSenha.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );
    component.senhaForm.patchValue({
      senhaAtual: 'Antiga@123',
      novaSenha: 'NovaSenha@123',
      confirmarSenha: 'NovaSenha@123'
    });

    component.alterarSenha();

    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'error',
      'Erro ao alterar a senha. Verifique sua senha atual.'
    );
  });

  it('should return appropriate validation error messages from getErrorMessage', () => {
    fixture.detectChanges();

    component.dadosForm.patchValue({ nome: '' });
    expect(component.getErrorMessage(component.dadosForm, 'nome')).toBe('Este campo é obrigatório.');

    component.dadosForm.patchValue({ nome: 'Ab' });
    expect(component.getErrorMessage(component.dadosForm, 'nome')).toBe('Mínimo de 3 caracteres.');

    component.dadosForm.patchValue({ nome: 'Valido' });
    expect(component.getErrorMessage(component.dadosForm, 'nome')).toBe('');

    component.senhaForm.patchValue({ novaSenha: 'abcdefgh' });
    expect(component.getErrorMessage(component.senhaForm, 'novaSenha')).toBe(
      'Falta: letra maiúscula, número, caractere especial.'
    );

    component.senhaForm.patchValue({ novaSenha: 'Abcdefg1' });
    expect(component.getErrorMessage(component.senhaForm, 'novaSenha')).toBe(
      'Falta: caractere especial.'
    );
  });
});
