import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoadorForm } from './doador-form';
import { IDoadorVM } from '../../services/doador.service';

describe('DoadorForm', () => {
  let component: DoadorForm;
  let fixture: ComponentFixture<DoadorForm>;

  const createComponent = (doador: IDoadorVM | null = null) => {
    fixture = TestBed.createComponent(DoadorForm);
    component = fixture.componentInstance;
    if (doador !== null) {
      fixture.componentRef.setInput('doador', doador);
    }
    fixture.detectChanges();
  };

  const getModalEl = (): HTMLElement | null =>
    document.body.querySelector('lumen-fullscreen-modal');

  const getLocalTodayIso = (): string => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoadorForm],
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

    it('deve ser criado em modo criação com campos vazios', () => {
      expect(component).toBeTruthy();
      expect(component.isEditMode()).toBeFalse();
      expect(component.form.valid).toBeFalse();
      expect(component.controls['id'].value).toBeNull();
      expect(component.controls['nome'].value).toBe('');
      expect(component.controls['email'].value).toBe('');
      expect(component.controls['dataNascimento'].value).toBe('');
    });

    it('deve exibir título Novo Doador e botão Cadastrar Doador', () => {
      const modal = getModalEl();
      expect(modal?.querySelector('.fullscreen-header .title span')?.textContent?.trim()).toBe('Novo Doador');
      expect(modal?.querySelector('lumen-button[type="primary"] button')?.textContent?.trim()).toBe('Cadastrar Doador');
    });

    it('deve validar nome obrigatório e comprimento mínimo', () => {
      expect(component.getErrorMessage('nome')).toBe('Este campo é obrigatório.');

      component.controls['nome'].setValue('Jo');
      expect(component.controls['nome'].hasError('minlength')).toBeTrue();
      expect(component.getErrorMessage('nome')).toBe('Mínimo de 3 caracteres.');

      component.controls['nome'].setValue('João Pedro');
      expect(component.controls['nome'].valid).toBeTrue();
      expect(component.getErrorMessage('nome')).toBe('');
    });

    it('deve validar formato de e-mail', () => {
      expect(component.getErrorMessage('email')).toBe('Este campo é obrigatório.');

      component.controls['email'].setValue('email-invalido');
      expect(component.controls['email'].hasError('email')).toBeTrue();
      expect(component.getErrorMessage('email')).toBe('Informe um e-mail válido.');

      component.controls['email'].setValue('maria@email.com');
      expect(component.controls['email'].valid).toBeTrue();
      expect(component.getErrorMessage('email')).toBe('');
    });

    it('deve rejeitar data de nascimento futura e aceitar data passada ou hoje', () => {
      expect(component.getErrorMessage('dataNascimento')).toBe('Este campo é obrigatório.');

      component.controls['dataNascimento'].setValue('2099-12-31');
      expect(component.controls['dataNascimento'].hasError('futureDate')).toBeTrue();
      expect(component.getErrorMessage('dataNascimento')).toBe('A data não pode ser no futuro.');

      component.controls['dataNascimento'].setValue(getLocalTodayIso());
      expect(component.controls['dataNascimento'].valid).toBeTrue();

      component.controls['dataNascimento'].setValue('1990-05-15');
      expect(component.controls['dataNascimento'].valid).toBeTrue();
      expect(component.getErrorMessage('dataNascimento')).toBe('');
    });

    it('não deve emitir salvar se inválido e deve marcar controles como touched', () => {
      const salvarSpy = spyOn(component.salvar, 'emit');

      component.onSubmit();

      expect(salvarSpy).not.toHaveBeenCalled();
      expect(component.controls['nome'].touched).toBeTrue();
      expect(component.controls['email'].touched).toBeTrue();
      expect(component.controls['dataNascimento'].touched).toBeTrue();
    });

    it('deve emitir salvar com os dados preenchidos quando o formulário for válido', () => {
      const salvarSpy = spyOn(component.salvar, 'emit');

      component.form.patchValue({
        nome: 'Maria da Silva',
        email: 'maria@email.com',
        dataNascimento: '1988-03-20'
      });

      component.onSubmit();

      expect(salvarSpy).toHaveBeenCalledOnceWith({
        id: null,
        nome: 'Maria da Silva',
        email: 'maria@email.com',
        dataNascimento: '1988-03-20'
      });
    });

    it('deve emitir fechar ao clicar em Cancelar ou fechar modal', () => {
      const fecharSpy = spyOn(component.fechar, 'emit');
      const modal = getModalEl();

      (modal?.querySelector('lumen-button[type="secondary"] button') as HTMLButtonElement).click();
      (modal?.querySelector('.close-btn') as HTMLButtonElement).click();

      expect(fecharSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('modo edição', () => {
    const doadorMock: IDoadorVM = {
      id: 'doador-42',
      nome: 'Carlos Souza',
      email: 'carlos@ufop.edu.br',
      dataNascimento: '1985-08-12T00:00:00Z'
    };

    beforeEach(() => {
      createComponent(doadorMock);
    });

    it('deve preencher formulário em modo edição convertendo dataNascimento ISO', () => {
      expect(component.isEditMode()).toBeTrue();
      expect(component.form.valid).toBeTrue();
      expect(component.controls['id'].value).toBe('doador-42');
      expect(component.controls['nome'].value).toBe('Carlos Souza');
      expect(component.controls['email'].value).toBe('carlos@ufop.edu.br');
      expect(component.controls['dataNascimento'].value).toBe('1985-08-12');
    });

    it('deve exibir título Editar Doador e botão Salvar Alterações', () => {
      const modal = getModalEl();
      expect(modal?.querySelector('.fullscreen-header .title span')?.textContent?.trim()).toBe('Editar Doador');
      expect(modal?.querySelector('lumen-button[type="primary"] button')?.textContent?.trim()).toBe('Salvar Alterações');
    });
  });
});
