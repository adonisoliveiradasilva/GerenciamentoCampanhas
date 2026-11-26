import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoacaoForm } from './doacao-form';
import { IItemVM } from '../../services/item.service';

describe('DoacaoForm', () => {
  let component: DoacaoForm;
  let fixture: ComponentFixture<DoacaoForm>;

  const createItemMock = (overrides: Partial<IItemVM> = {}): IItemVM => ({
    id: 'item-1',
    nome: 'Cesta Básica',
    quantidade: 10,
    dataChegada: '2026-04-10T00:00:00Z',
    campanhaId: 'camp-1',
    dataCriacao: '2026-04-10T10:00:00Z',
    usuarioCriadorNome: 'Admin',
    ...overrides
  });

  const createComponent = (item: IItemVM = createItemMock()) => {
    fixture = TestBed.createComponent(DoacaoForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();
  };

  const getModalEl = (): HTMLElement | null =>
    document.body.querySelector('lumen-fullscreen-modal');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoacaoForm],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('deve ser criado e inicializar formulário com quantidade 1 e data atual', () => {
    createComponent();

    expect(component).toBeTruthy();
    expect(component.controls['quantidade'].value).toBe(1);
    expect(component.controls['dataDoacao'].value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(component.controls['destino'].value).toBe('');
    expect(component.form.valid).toBeFalse();
  });

  it('deve renderizar banner informativo com nome e estoque do item', () => {
    createComponent(createItemMock({ nome: 'Casaco de Lã', quantidade: 7 }));

    const modal = getModalEl();
    expect(modal?.querySelector('.fullscreen-header .title span')?.textContent?.trim()).toBe('Registrar Doação');
    expect(modal?.querySelector('.info-banner')?.textContent).toContain('Casaco de Lã');
    expect(modal?.querySelector('.info-banner')?.textContent).toContain('Estoque: 7 un.');
  });

  it('deve validar limites mínimo, máximo e obrigatoriedade da quantidade', () => {
    createComponent(createItemMock({ quantidade: 5 }));

    component.controls['quantidade'].setValue(null);
    expect(component.getErrorMessage('quantidade')).toBe('Este campo é obrigatório.');

    component.controls['quantidade'].setValue(0);
    expect(component.controls['quantidade'].hasError('min')).toBeTrue();
    expect(component.getErrorMessage('quantidade')).toBe('Doação mínima de 1 unidade.');

    component.controls['quantidade'].setValue(6);
    expect(component.controls['quantidade'].hasError('max')).toBeTrue();
    expect(component.getErrorMessage('quantidade')).toBe('Você só possui 5 unidades no estoque.');

    component.controls['quantidade'].setValue(5);
    expect(component.controls['quantidade'].valid).toBeTrue();
    expect(component.getErrorMessage('quantidade')).toBe('');
  });

  it('deve usar estoque máximo 1 como fallback quando quantidade do item for indefinida ou zero', () => {
    createComponent(createItemMock({ quantidade: 0 }));

    component.controls['quantidade'].setValue(2);
    expect(component.controls['quantidade'].hasError('max')).toBeTrue();
    expect(component.getErrorMessage('quantidade')).toBe('Você só possui 1 unidades no estoque.');
  });

  it('deve validar destino obrigatório e tamanho mínimo de 3 caracteres', () => {
    createComponent();

    expect(component.getErrorMessage('destino')).toBe('Este campo é obrigatório.');

    component.controls['destino'].setValue('Ab');
    expect(component.controls['destino'].hasError('minlength')).toBeTrue();
    expect(component.getErrorMessage('destino')).toBe('Mínimo de 3 caracteres.');

    component.controls['destino'].setValue('Lar de Maria');
    expect(component.controls['destino'].valid).toBeTrue();
    expect(component.getErrorMessage('destino')).toBe('');
  });

  it('não deve emitir salvar quando formulário inválido e deve marcar controles como touched', () => {
    createComponent();
    const salvarSpy = spyOn(component.salvar, 'emit');

    component.onSubmit();

    expect(salvarSpy).not.toHaveBeenCalled();
    expect(component.controls['destino'].touched).toBeTrue();
    expect(component.controls['quantidade'].touched).toBeTrue();
    expect(component.controls['dataDoacao'].touched).toBeTrue();
  });

  it('deve emitir salvar ao confirmar baixa com dados válidos', () => {
    createComponent(createItemMock({ quantidade: 10 }));
    const salvarSpy = spyOn(component.salvar, 'emit');

    component.form.patchValue({
      quantidade: 3,
      dataDoacao: '2026-05-12',
      destino: 'Família da Rua 2'
    });

    const confirmBtn = getModalEl()?.querySelector('lumen-button[type="primary"] button') as HTMLButtonElement;
    confirmBtn.click();

    expect(salvarSpy).toHaveBeenCalledOnceWith({
      quantidade: 3,
      dataDoacao: '2026-05-12',
      destino: 'Família da Rua 2'
    });
  });

  it('deve emitir fechar ao clicar em Cancelar ou fechar modal', () => {
    createComponent();
    const fecharSpy = spyOn(component.fechar, 'emit');
    const modal = getModalEl();

    (modal?.querySelector('lumen-button[type="secondary"] button') as HTMLButtonElement).click();
    (modal?.querySelector('.close-btn') as HTMLButtonElement).click();

    expect(fecharSpy).toHaveBeenCalledTimes(2);
  });
});
