import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoricoDoacoesModal } from './historico-doacoes-modal';
import { IItemVM } from '../../services/item.service';

describe('HistoricoDoacoesModal', () => {
  let component: HistoricoDoacoesModal;
  let fixture: ComponentFixture<HistoricoDoacoesModal>;

  const createItemMock = (overrides: Partial<IItemVM> = {}): IItemVM => ({
    id: 'item-10',
    nome: 'Cobertor Casal',
    quantidade: 4,
    dataChegada: '2026-03-01T00:00:00Z',
    campanhaId: 'camp-1',
    dataCriacao: '2026-03-01T10:00:00Z',
    usuarioCriadorNome: 'Admin',
    historicoDoacoes: [
      {
        id: 'doc-1',
        quantidade: 1,
        dataDoacao: '2026-03-15T00:00:00Z',
        destino: 'Família Silva',
        usuarioNome: 'Diácono José'
      },
      {
        id: 'doc-2',
        quantidade: 3,
        dataDoacao: '2026-04-02T00:00:00Z',
        destino: 'Abrigo Esperança',
        usuarioNome: 'Maria Admin'
      }
    ],
    ...overrides
  });

  const createComponent = (item: IItemVM = createItemMock()) => {
    fixture = TestBed.createComponent(HistoricoDoacoesModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();
  };

  const getModalEl = (): HTMLElement | null =>
    document.body.querySelector('lumen-fullscreen-modal');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoDoacoesModal],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('deve ser criado e exibir o título do modal e o nome do item', () => {
    createComponent();

    const modal = getModalEl();
    expect(component).toBeTruthy();
    expect(modal?.querySelector('.fullscreen-header .title span')?.textContent?.trim()).toBe('Histórico de Doações');
    expect(modal?.querySelector('.item-title')?.textContent?.trim()).toBe('Cobertor Casal');
  });

  it('deve renderizar a linha do tempo com singular e plural corretos, destino, data e auditoria', () => {
    createComponent();

    const items = getModalEl()?.querySelectorAll('.timeline-item');
    expect(items?.length).toBe(2);

    const first = items![0];
    expect(first.querySelector('.timeline-date')?.textContent).toContain('15/03/2026');
    expect(first.querySelector('.timeline-content')?.textContent).toContain('1 un.');
    expect(first.querySelector('.timeline-content')?.textContent).toContain('entregue para');
    expect(first.querySelector('.timeline-content')?.textContent).toContain('Família Silva');
    expect(first.querySelector('.timeline-audit')?.textContent).toContain('Diácono José');

    const second = items![1];
    expect(second.querySelector('.timeline-date')?.textContent).toContain('02/04/2026');
    expect(second.querySelector('.timeline-content')?.textContent).toContain('3 un.');
    expect(second.querySelector('.timeline-content')?.textContent).toContain('entregues para');
    expect(second.querySelector('.timeline-content')?.textContent).toContain('Abrigo Esperança');
    expect(second.querySelector('.timeline-audit')?.textContent).toContain('Maria Admin');
  });

  it('deve lidar com histórico vazio ou indefinido sem renderizar itens na timeline', () => {
    createComponent(createItemMock({ historicoDoacoes: [] }));
    expect(getModalEl()?.querySelectorAll('.timeline-item').length).toBe(0);
  });

  it('deve formatar datas ISO no padrão pt-BR e retornar string vazia quando entrada for vazia', () => {
    createComponent();

    expect(component.formatarDataBr('')).toBe('');
    expect(component.formatarDataBr('2026-12-25T00:00:00Z')).toBe('25/12/2026');
  });

  it('deve emitir fechar ao clicar em Fechar Histórico ou no botão de fechar do modal', () => {
    createComponent();
    const fecharSpy = spyOn(component.fechar, 'emit');
    const modal = getModalEl();

    (modal?.querySelector('lumen-button button') as HTMLButtonElement).click();
    (modal?.querySelector('.close-btn') as HTMLButtonElement).click();

    expect(fecharSpy).toHaveBeenCalledTimes(2);
  });
});
