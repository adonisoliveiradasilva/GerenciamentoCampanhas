import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampanhaForm } from './campanha-form';
import { ICampanhaVM } from '../../services/campanha.service';

describe('CampanhaForm', () => {
  let component: CampanhaForm;
  let fixture: ComponentFixture<CampanhaForm>;

  const createComponent = (campanha: ICampanhaVM | null = null) => {
    fixture = TestBed.createComponent(CampanhaForm);
    component = fixture.componentInstance;
    if (campanha !== null) {
      fixture.componentRef.setInput('campanha', campanha);
    }
    fixture.detectChanges();
  };

  const getModalEl = (): HTMLElement | null =>
    document.body.querySelector('lumen-fullscreen-modal');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampanhaForm],
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

    it('deve ser criado em modo de criação com formulário inicializado vazio', () => {
      expect(component).toBeTruthy();
      expect(component.isEditMode()).toBeFalse();
      expect(component.form.valid).toBeFalse();
      expect(component.controls['id'].value).toBeNull();
      expect(component.controls['nome'].value).toBe('');
      expect(component.controls['local'].value).toBe('');
      expect(component.controls['dataInicio'].value).toBe('');
      expect(component.controls['dataFim'].value).toBe('');
      expect(component.controls['descricao'].value).toBe('');
    });

    it('deve exibir título e texto do botão para nova campanha', () => {
      const modal = getModalEl();
      expect(modal?.querySelector('.fullscreen-header .title span')?.textContent?.trim()).toBe('Nova Campanha');
      const primaryBtn = modal?.querySelector('lumen-button[type="primary"] button');
      expect(primaryBtn?.textContent?.trim()).toBe('Criar Campanha');
    });

    it('deve validar campos obrigatórios e tamanho mínimo do nome', () => {
      expect(component.getErrorMessage('nome')).toBe('Este campo é obrigatório.');
      expect(component.getErrorMessage('local')).toBe('Este campo é obrigatório.');
      expect(component.getErrorMessage('dataInicio')).toBe('Este campo é obrigatório.');
      expect(component.getErrorMessage('descricao')).toBe('');

      component.controls['nome'].setValue('AB');
      expect(component.controls['nome'].hasError('minlength')).toBeTrue();
      expect(component.getErrorMessage('nome')).toBe('Mínimo de 3 caracteres.');

      component.controls['nome'].setValue('Agasalho');
      expect(component.controls['nome'].valid).toBeTrue();
      expect(component.getErrorMessage('nome')).toBe('');
    });

    it('não deve emitir salvar quando o formulário for inválido e deve marcar controles como touched', () => {
      const salvarSpy = spyOn(component.salvar, 'emit');

      component.onSubmit();

      expect(salvarSpy).not.toHaveBeenCalled();
      expect(component.controls['nome'].touched).toBeTrue();
      expect(component.controls['local'].touched).toBeTrue();
      expect(component.controls['dataInicio'].touched).toBeTrue();
    });

    it('deve emitir salvar com os valores do formulário quando válido', () => {
      const salvarSpy = spyOn(component.salvar, 'emit');

      component.form.patchValue({
        nome: 'Campanha do Agasalho 2026',
        local: 'Galpão Principal',
        dataInicio: '2026-05-01',
        dataFim: '2026-06-30',
        descricao: 'Arrecadação de roupas de inverno'
      });

      component.onSubmit();

      expect(salvarSpy).toHaveBeenCalledOnceWith({
        id: null,
        nome: 'Campanha do Agasalho 2026',
        local: 'Galpão Principal',
        dataInicio: '2026-05-01',
        dataFim: '2026-06-30',
        descricao: 'Arrecadação de roupas de inverno'
      });
    });

    it('deve emitir fechar ao clicar no botão Cancelar ou no botão de fechar do modal', () => {
      const fecharSpy = spyOn(component.fechar, 'emit');
      const modal = getModalEl();

      const cancelBtn = modal?.querySelector('lumen-button[type="secondary"] button') as HTMLButtonElement;
      cancelBtn.click();

      const closeBtn = modal?.querySelector('.close-btn') as HTMLButtonElement;
      closeBtn.click();

      expect(fecharSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('modo edição', () => {
    const campanhaMock: ICampanhaVM = {
      id: 'camp-123',
      nome: 'Natal Solidário',
      local: 'Paróquia Matriz',
      descricao: 'Cestas básicas e brinquedos',
      dataInicio: '2026-11-01T00:00:00Z',
      dataFim: '2026-12-24T23:59:59Z'
    };

    beforeEach(() => {
      createComponent(campanhaMock);
    });

    it('deve preencher o formulário normalizando datas ISO para YYYY-MM-DD', () => {
      expect(component.isEditMode()).toBeTrue();
      expect(component.form.valid).toBeTrue();
      expect(component.controls['id'].value).toBe('camp-123');
      expect(component.controls['nome'].value).toBe('Natal Solidário');
      expect(component.controls['local'].value).toBe('Paróquia Matriz');
      expect(component.controls['dataInicio'].value).toBe('2026-11-01');
      expect(component.controls['dataFim'].value).toBe('2026-12-24');
      expect(component.controls['descricao'].value).toBe('Cestas básicas e brinquedos');
    });

    it('deve exibir título e botão de salvar alterações em modo edição', () => {
      const modal = getModalEl();
      expect(modal?.querySelector('.fullscreen-header .title span')?.textContent?.trim()).toBe('Editar Campanha');
      const primaryBtn = modal?.querySelector('lumen-button[type="primary"] button');
      expect(primaryBtn?.textContent?.trim()).toBe('Salvar Alterações');
    });

    it('deve emitir os dados atualizados ao clicar no botão primário', () => {
      const salvarSpy = spyOn(component.salvar, 'emit');
      component.controls['nome'].setValue('Natal Solidário Atualizado');

      const primaryBtn = getModalEl()?.querySelector('lumen-button[type="primary"] button') as HTMLButtonElement;
      primaryBtn.click();

      expect(salvarSpy).toHaveBeenCalledOnceWith({
        id: 'camp-123',
        nome: 'Natal Solidário Atualizado',
        local: 'Paróquia Matriz',
        dataInicio: '2026-11-01',
        dataFim: '2026-12-24',
        descricao: 'Cestas básicas e brinquedos'
      });
    });
  });
});
