import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, Subject, throwError } from 'rxjs';
import { ItemForm } from './item-form';
import { IItemVM } from '../../services/item.service';
import { CampanhaService, ICampanhaVM } from '../../../campanha/services/campanha.service';
import { DoadorService, IDoadorVM } from '../../../doador/services/doador.service';
import { ToastService } from '../../../toast/services/toast-service';

describe('ItemForm', () => {
  let component: ItemForm;
  let fixture: ComponentFixture<ItemForm>;
  let campanhaServiceSpy: jasmine.SpyObj<CampanhaService>;
  let doadorServiceSpy: jasmine.SpyObj<DoadorService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const campanhasMock: ICampanhaVM[] = [
    {
      id: 'c-1',
      nome: 'Campanha do Agasalho',
      local: 'Matriz',
      descricao: 'Roupas',
      dataInicio: '2026-05-01',
      dataFim: '2026-06-30'
    },
    {
      id: 'c-2',
      nome: 'Natal Solidário',
      local: 'Centro',
      descricao: 'Alimentos',
      dataInicio: '2026-11-01',
      dataFim: '2026-12-24'
    }
  ];

  const doadoresMock: IDoadorVM[] = [
    {
      id: 'd-1',
      nome: 'Maria Silva',
      email: 'maria@email.com',
      dataNascimento: '1990-01-10'
    }
  ];

  const createComponent = (item: IItemVM | null = null) => {
    fixture = TestBed.createComponent(ItemForm);
    component = fixture.componentInstance;
    if (item !== null) {
      fixture.componentRef.setInput('item', item);
    }
    fixture.detectChanges();
  };

  const getModalEl = (): HTMLElement | null =>
    (fixture.debugElement.query(By.css('lumen-fullscreen-modal'))?.nativeElement as HTMLElement) ?? null;

  beforeEach(async () => {
    campanhaServiceSpy = jasmine.createSpyObj<CampanhaService>('CampanhaService', ['getAll']);
    doadorServiceSpy = jasmine.createSpyObj<DoadorService>('DoadorService', ['getAll']);
    toastServiceSpy = jasmine.createSpyObj<ToastService>('ToastService', ['show']);

    campanhaServiceSpy.getAll.and.returnValue(of(campanhasMock));
    doadorServiceSpy.getAll.and.returnValue(of(doadoresMock));

    await TestBed.configureTestingModule({
      imports: [ItemForm],
      providers: [
        provideZonelessChangeDetection(),
        { provide: CampanhaService, useValue: campanhaServiceSpy },
        { provide: DoadorService, useValue: doadorServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  describe('carregamento de dependências', () => {
    it('deve exibir loading e desabilitar botões enquanto carrega campanhas e doadores', () => {
      const campanhas$ = new Subject<ICampanhaVM[]>();
      const doadores$ = new Subject<IDoadorVM[]>();
      campanhaServiceSpy.getAll.and.returnValue(campanhas$.asObservable());
      doadorServiceSpy.getAll.and.returnValue(doadores$.asObservable());

      createComponent(null);

      const modal = getModalEl();
      expect(component.isDependenciesLoading()).toBeTrue();
      expect(modal?.querySelector('lumen-loading')).toBeTruthy();
      expect(modal?.querySelector('form')).toBeNull();

      const buttons = modal?.querySelectorAll('footer lumen-button button') as NodeListOf<HTMLButtonElement>;
      expect(buttons[0].disabled).toBeTrue();
      expect(buttons[1].disabled).toBeTrue();

      campanhas$.next(campanhasMock);
      campanhas$.complete();
      doadores$.next(doadoresMock);
      doadores$.complete();
      fixture.detectChanges();

      expect(component.isDependenciesLoading()).toBeFalse();
      expect(modal?.querySelector('lumen-loading')).toBeNull();
      expect(modal?.querySelector('form')).toBeTruthy();
    });

    it('deve popular opções de campanhas e doadores incluindo opção Sem Doador Vinculado', () => {
      createComponent(null);

      expect(component.campanhasOptions()).toEqual([
        { label: 'Campanha do Agasalho', value: 'c-1' },
        { label: 'Natal Solidário', value: 'c-2' }
      ]);
      expect(component.doadoresOptions()).toEqual([
        { label: 'Sem Doador Vinculado', value: '' },
        { label: 'Maria Silva (maria@email.com)', value: 'd-1' }
      ]);
    });

    it('deve exibir toast de erro e encerrar loading quando falhar o carregamento das dependências', () => {
      campanhaServiceSpy.getAll.and.returnValue(throwError(() => new Error('Falha na API')));

      createComponent(null);

      expect(component.isDependenciesLoading()).toBeFalse();
      expect(toastServiceSpy.show).toHaveBeenCalledOnceWith('error', 'Erro ao carregar campanhas e doadores.');
    });
  });

  describe('modo criação e validações', () => {
    beforeEach(() => {
      createComponent(null);
    });

    it('deve ser criado em modo criação com valores iniciais', () => {
      const modal = getModalEl();
      expect(component).toBeTruthy();
      expect(component.isEditMode()).toBeFalse();
      expect(modal?.querySelector('.fullscreen-header .title span')?.textContent?.trim()).toBe('Novo Item');
      expect(modal?.querySelector('lumen-button[type="primary"] button')?.textContent?.trim()).toBe('Cadastrar Item');
      expect(modal?.querySelector('.audit-info-section')).toBeNull();
      expect(component.controls['quantidade'].value).toBe(1);
    });

    it('deve retornar mensagens de erro adequadas para required, minlength, min e maxImages', () => {
      expect(component.getErrorMessage('nome')).toBe('Este campo é obrigatório.');
      expect(component.getErrorMessage('campanhaId')).toBe('Este campo é obrigatório.');
      expect(component.getErrorMessage('dataChegada')).toBe('Este campo é obrigatório.');

      component.controls['nome'].setValue('A');
      expect(component.getErrorMessage('nome')).toBe('Mínimo de 2 caracteres.');

      component.controls['quantidade'].setValue(-1);
      expect(component.getErrorMessage('quantidade')).toBe('Valor mínimo: 0.');

      component.controls['imagens'].setValue(['1', '2', '3', '4', '5']);
      expect(component.controls['imagens'].valid).toBeTrue();

      component.controls['imagens'].setValue(['1', '2', '3', '4', '5', '6']);
      expect(component.controls['imagens'].hasError('maxImages')).toBeTrue();
      expect(component.getErrorMessage('imagens')).toBe('Limite máximo de 5 imagens excedido.');

      component.controls['nome'].setValue('Casaco');
      expect(component.getErrorMessage('nome')).toBe('');
    });

    it('deve encaminhar erro de imagem inválida para o ToastService', () => {
      component.handleInvalidImage('Formato inválido.');
      expect(toastServiceSpy.show).toHaveBeenCalledOnceWith('error', 'Formato inválido.');
    });

    it('não deve emitir salvar se o formulário for inválido e deve marcar controles como touched', () => {
      const salvarSpy = spyOn(component.salvar, 'emit');

      component.onSubmit();

      expect(salvarSpy).not.toHaveBeenCalled();
      expect(component.controls['nome'].touched).toBeTrue();
      expect(component.controls['campanhaId'].touched).toBeTrue();
      expect(component.controls['dataChegada'].touched).toBeTrue();
    });

    it('deve converter doadorId vazio para null ao submeter formulário válido', () => {
      const salvarSpy = spyOn(component.salvar, 'emit');

      component.form.patchValue({
        nome: 'Cesta Básica',
        quantidade: 5,
        dataChegada: '2026-05-10',
        campanhaId: 'c-1',
        doadorId: ''
      });

      component.onSubmit();

      expect(salvarSpy).toHaveBeenCalledOnceWith(jasmine.objectContaining({
        nome: 'Cesta Básica',
        quantidade: 5,
        dataChegada: '2026-05-10',
        campanhaId: 'c-1',
        doadorId: null
      }));
    });

    it('deve manter doadorId selecionado ao submeter formulário válido', () => {
      const salvarSpy = spyOn(component.salvar, 'emit');

      component.form.patchValue({
        nome: 'Cobertor',
        quantidade: 2,
        dataChegada: '2026-05-11',
        campanhaId: 'c-2',
        doadorId: 'd-1'
      });

      component.onSubmit();

      expect(salvarSpy).toHaveBeenCalledOnceWith(jasmine.objectContaining({
        doadorId: 'd-1',
        campanhaId: 'c-2'
      }));
    });

    it('deve emitir fechar ao clicar em Cancelar', () => {
      const fecharSpy = spyOn(component.fechar, 'emit');
      const cancelBtn = getModalEl()?.querySelector('footer lumen-button[type="secondary"] button') as HTMLButtonElement;
      cancelBtn.click();

      expect(fecharSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('modo edição', () => {
    const itemMock: IItemVM = {
      id: 'item-99',
      nome: 'Agasalho Infantil',
      descricao: 'Tamanho 8 anos',
      quantidade: 3,
      dataChegada: '2026-04-15T00:00:00Z',
      horaPego: '2026-04-15T14:35:00Z',
      lugarPego: 'Galpão da Matriz',
      campanhaId: 'c-1',
      doadorId: undefined,
      imagens: undefined,
      dataCriacao: '2026-04-15T15:00:00',
      usuarioCriadorNome: 'João Criador',
      dataUltimaAtualizacao: '2026-04-16T09:20:00',
      usuarioAtualizadorNome: 'Maria Editora'
    };

    beforeEach(() => {
      createComponent(itemMock);
    });

    it('deve preencher formulário normalizando dataChegada, horaPego, doadorId e imagens', () => {
      expect(component.isEditMode()).toBeTrue();
      expect(component.form.valid).toBeTrue();
      expect(component.controls['id'].value).toBe('item-99');
      expect(component.controls['nome'].value).toBe('Agasalho Infantil');
      expect(component.controls['dataChegada'].value).toBe('2026-04-15');
      expect(component.controls['horaPego'].value).toBe('14:35');
      expect(component.controls['doadorId'].value).toBe('');
      expect(component.controls['imagens'].value).toEqual([]);
    });

    it('deve renderizar título Editar Item, botão Salvar Alterações e seção de auditoria completa', () => {
      const modal = getModalEl();
      expect(modal?.querySelector('.fullscreen-header .title span')?.textContent?.trim()).toBe('Editar Item');
      expect(modal?.querySelector('lumen-button[type="primary"] button')?.textContent?.trim()).toBe('Salvar Alterações');

      const auditRows = modal?.querySelectorAll('.audit-info-section .audit-row');
      expect(auditRows?.length).toBe(2);
      expect(auditRows![0].textContent).toContain('João Criador');
      expect(auditRows![1].textContent).toContain('Maria Editora');
    });
  });
});
