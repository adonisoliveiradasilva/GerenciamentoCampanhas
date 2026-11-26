import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioForm } from './usuario-form';
import { IUsuarioVM } from '../../../../pages/usuarios/usuarios';

describe('UsuarioForm', () => {
  let component: UsuarioForm;
  let fixture: ComponentFixture<UsuarioForm>;

  const createComponent = (usuario: IUsuarioVM | null = null) => {
    fixture = TestBed.createComponent(UsuarioForm);
    component = fixture.componentInstance;
    if (usuario !== null) {
      fixture.componentRef.setInput('usuario', usuario);
    }
    fixture.detectChanges();
  };

  const getModalEl = (): HTMLElement | null =>
    document.body.querySelector('lumen-fullscreen-modal');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioForm],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  describe('modo criação', () => {
    beforeEach(() => {
      createComponent(null);
    });

    it('deve ser criado em modo criação com perfil Diacono, status ativo e e-mail habilitado', () => {
      expect(component).toBeTruthy();
      expect(component.isEditMode()).toBeFalse();
      expect(component.controls['id'].value).toBeNull();
      expect(component.controls['nome'].value).toBe('');
      expect(component.controls['email'].value).toBe('');
      expect(component.controls['email'].disabled).toBeFalse();
      expect(component.controls['perfil'].value).toBe('Diacono');
      expect(component.controls['status'].value).toBe('ativo');
    });

    it('deve exibir título Novo Usuário e botão Criar Usuário', () => {
      const modal = getModalEl();
      expect(modal?.querySelector('.fullscreen-header .title span')?.textContent?.trim()).toBe('Novo Usuário');
      expect(modal?.querySelector('lumen-button[type="primary"] button')?.textContent?.trim()).toBe('Criar Usuário');
    });

    it('deve validar nome obrigatório, minlength e formato de e-mail', () => {
      expect(component.getErrorMessage('nome')).toBe('Este campo é obrigatório.');
      expect(component.getErrorMessage('email')).toBe('Este campo é obrigatório.');

      component.controls['nome'].setValue('Ab');
      expect(component.getErrorMessage('nome')).toBe('Deve ter pelo menos 3 caracteres.');

      component.controls['email'].setValue('email-invalido');
      expect(component.getErrorMessage('email')).toBe('Informe um e-mail válido.');

      component.controls['nome'].setValue('Adonis Oliveira');
      component.controls['email'].setValue('adonis@aluno.ufop.edu.br');
      expect(component.getErrorMessage('nome')).toBe('');
      expect(component.getErrorMessage('email')).toBe('');
    });

    it('não deve emitir salvar quando inválido e deve marcar controles como touched', () => {
      const salvarSpy = spyOn(component.salvar, 'emit');

      component.onSubmit();

      expect(salvarSpy).not.toHaveBeenCalled();
      expect(component.controls['nome'].touched).toBeTrue();
      expect(component.controls['email'].touched).toBeTrue();
    });

    it('deve emitir salvar com todos os valores do formulário quando válido', () => {
      const salvarSpy = spyOn(component.salvar, 'emit');

      component.form.patchValue({
        nome: 'Adonis Oliveira',
        email: 'adonis@aluno.ufop.edu.br',
        perfil: 'Administrador',
        status: 'ativo'
      });

      component.onSubmit();

      expect(salvarSpy).toHaveBeenCalledOnceWith({
        id: null,
        nome: 'Adonis Oliveira',
        email: 'adonis@aluno.ufop.edu.br',
        perfil: 'Administrador',
        status: 'ativo'
      });
    });

    it('deve emitir fechar ao clicar em Cancelar ou no botão fechar do modal', () => {
      const fecharSpy = spyOn(component.fechar, 'emit');
      const modal = getModalEl();

      (modal?.querySelector('lumen-button[type="secondary"] button') as HTMLButtonElement).click();
      (modal?.querySelector('.close-btn') as HTMLButtonElement).click();

      expect(fecharSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('modo edição', () => {
    const usuarioMock = {
      id: 'usr-7',
      nome: 'Maria Admin',
      email: 'maria@ufop.edu.br',
      perfil: 'Administrador',
      status: 'inativo',
      statusLabel: 'Inativo',
      statusCss: 'danger',
      statusIcon: 'fa-solid fa-ban',
      dataCriacao: new Date('2026-01-15T12:00:00Z')
    } as IUsuarioVM;

    beforeEach(() => {
      createComponent(usuarioMock);
    });

    it('deve preencher dados do usuário e desabilitar o campo de e-mail em modo edição', () => {
      expect(component.isEditMode()).toBeTrue();
      expect(component.controls['id'].value).toBe('usr-7');
      expect(component.controls['nome'].value).toBe('Maria Admin');
      expect(component.controls['email'].value).toBe('maria@ufop.edu.br');
      expect(component.controls['email'].disabled).toBeTrue();
      expect(component.controls['perfil'].value).toBe('Administrador');
      expect(component.controls['status'].value).toBe('inativo');
      expect(component.form.valid).toBeTrue();
    });

    it('deve exibir título Editar Usuário e botão Salvar Alterações', () => {
      const modal = getModalEl();
      expect(modal?.querySelector('.fullscreen-header .title span')?.textContent?.trim()).toBe('Editar Usuário');
      expect(modal?.querySelector('lumen-button[type="primary"] button')?.textContent?.trim()).toBe('Salvar Alterações');
    });

    it('deve incluir o campo desabilitado de e-mail no payload emitido via getRawValue()', () => {
      const salvarSpy = spyOn(component.salvar, 'emit');
      component.controls['nome'].setValue('Maria Administradora');

      const submitBtn = getModalEl()?.querySelector('lumen-button[type="primary"] button') as HTMLButtonElement;
      submitBtn.click();

      expect(salvarSpy).toHaveBeenCalledOnceWith({
        id: 'usr-7',
        nome: 'Maria Administradora',
        email: 'maria@ufop.edu.br',
        perfil: 'Administrador',
        status: 'inativo'
      });
    });
  });
});
