import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Menu } from 'primeng/menu';
import { GridList, IGridAction, IGridFilter } from './grid-list';

interface MockGridItem {
  id: string;
  nome: string;
  campanhaNome?: string;
  dataChegadaFormatada?: string;
  quantidade: number;
  imagens?: string[];
  categoria?: string;
}

describe('GridList', () => {
  let component: GridList<MockGridItem>;
  let fixture: ComponentFixture<GridList<MockGridItem>>;

  const mockItems: MockGridItem[] = [
    {
      id: '1',
      nome: 'Cesta Básica',
      campanhaNome: 'Natal Solidário',
      dataChegadaFormatada: '10/12/2025',
      quantidade: 15,
      imagens: ['img-a.jpg', 'img-b.jpg', 'img-c.jpg'],
      categoria: 'Alimentos',
    },
    {
      id: '2',
      nome: 'Agasalho Infantil',
      campanhaNome: 'Inverno Quente',
      dataChegadaFormatada: '15/06/2025',
      quantidade: 0,
      imagens: [],
      categoria: 'Roupas',
    },
    {
      id: '3',
      nome: 'Cobertor Casal',
      quantidade: 4,
      imagens: ['single.jpg'],
      categoria: 'Roupas',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridList],
      providers: [provideZonelessChangeDetection(), provideAnimationsAsync('noop')],
    }).compileComponents();

    fixture = TestBed.createComponent(GridList<MockGridItem>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockItems);
    fixture.detectChanges();
  });

  it('should create and show loading state by default', () => {
    expect(component).toBeTruthy();
    expect(component.isLoading()).toBeTrue();
    expect(fixture.nativeElement.querySelector('lumen-loading')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.cards-grid')).toBeNull();
    expect(fixture.nativeElement.querySelector('p-paginator')).toBeNull();
  });

  it('should display title and emit createAction when create button is clicked', () => {
    fixture.componentRef.setInput('title', 'Itens Doados');
    fixture.componentRef.setInput('createButtonLabel', 'Adicionar Item');
    fixture.detectChanges();

    const createSpy = jasmine.createSpy('createAction');
    component.createAction.subscribe(createSpy);

    expect(fixture.nativeElement.querySelector('lumen-page-header').textContent).toContain('Itens Doados');
    const createBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.grid-content-header lumen-button button');
    expect(createBtn.textContent?.trim()).toBe('Adicionar Item');

    createBtn.click();
    expect(createSpy).toHaveBeenCalledTimes(1);

    fixture.componentRef.setInput('showCreateButton', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.grid-content-header lumen-button')).toBeNull();
  });

  it('should render empty feedback state when not loading and data is empty', () => {
    fixture.componentRef.setInput('data', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('emptyMessage', 'Sem itens cadastrados.');
    fixture.detectChanges();

    const feedback = fixture.nativeElement.querySelector('lumen-feedback-state');
    expect(feedback).toBeTruthy();
    expect(feedback.textContent).toContain('Sem itens cadastrados.');
    expect(fixture.nativeElement.querySelector('p-paginator')).toBeNull();
  });

  it('should render cards with item details, fallback labels, zero-quantity badge style, and no-image placeholder', () => {
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.grid-card');
    expect(cards.length).toBe(3);

    expect(cards[0].querySelector('.card-title').textContent.trim()).toBe('Cesta Básica');
    expect(cards[0].querySelector('.card-subtitle').textContent).toContain('Natal Solidário');
    expect(cards[0].querySelector('.card-date').textContent).toContain('10/12/2025');
    expect(cards[0].querySelector('.qty-badge').textContent.trim()).toBe('15 un.');
    expect(cards[0].querySelector('.card-img').getAttribute('src')).toBe('img-a.jpg');

    expect(cards[1].querySelector('.no-image')).toBeTruthy();
    expect(cards[1].querySelector('.qty-badge').style.backgroundColor).toBe('var(--color-text-label)');

    expect(cards[2].querySelector('.card-subtitle').textContent).toContain('Sem Campanha');
    expect(cards[2].querySelector('.card-date').textContent).toContain('N/A');
    expect(cards[2].querySelectorAll('.carousel-btn').length).toBe(0);
  });

  it('should cycle through card images with nextImage and prevImage and stop event propagation', () => {
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const firstCard = fixture.nativeElement.querySelectorAll('.grid-card')[0];
    expect(firstCard.querySelectorAll('.carousel-indicators .dot').length).toBe(3);
    expect(component.getCurrentImageIndex('1')).toBe(0);

    const nextEvent = new MouseEvent('click');
    const nextStopSpy = spyOn(nextEvent, 'stopPropagation');
    component.nextImage(nextEvent, '1', 3);
    expect(nextStopSpy).toHaveBeenCalled();
    expect(component.getCurrentImageIndex('1')).toBe(1);

    component.nextImage(new MouseEvent('click'), '1', 3);
    expect(component.getCurrentImageIndex('1')).toBe(2);

    component.nextImage(new MouseEvent('click'), '1', 3);
    expect(component.getCurrentImageIndex('1')).toBe(0);

    const prevEvent = new MouseEvent('click');
    const prevStopSpy = spyOn(prevEvent, 'stopPropagation');
    component.prevImage(prevEvent, '1', 3);
    expect(prevStopSpy).toHaveBeenCalled();
    expect(component.getCurrentImageIndex('1')).toBe(2);
  });

  it('should filter data by search term across globalFilterFields and reset pagination', () => {
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('globalFilterFields', ['nome', 'campanhaNome']);
    fixture.detectChanges();

    component.first.set(10);
    component.onSearchChange('  inverno  ');
    fixture.detectChanges();

    expect(component.first()).toBe(0);
    expect(component.filteredData().length).toBe(1);
    expect(component.filteredData()[0].id).toBe('2');
    expect(fixture.nativeElement.querySelectorAll('.grid-card').length).toBe(1);

    component.onSearchChange('inexistente');
    fixture.detectChanges();
    expect(component.filteredData().length).toBe(0);
    expect(fixture.nativeElement.querySelector('lumen-feedback-state')).toBeTruthy();
  });

  it('should filter data by dropdown filters and combine with search', () => {
    const filters: IGridFilter[] = [
      {
        label: 'Categoria',
        field: 'categoria',
        options: [
          { label: 'Todas', value: '' },
          { label: 'Alimentos', value: 'Alimentos' },
          { label: 'Roupas', value: 'Roupas' },
        ],
      },
    ];
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('dropdownFilters', filters);
    fixture.componentRef.setInput('globalFilterFields', ['nome']);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('lumen-select-mini').length).toBe(1);

    component.first.set(5);
    component.onFilterChange('categoria', 'Roupas');
    expect(component.first()).toBe(0);
    expect(component.filteredData().map((i) => i.id)).toEqual(['2', '3']);

    component.onSearchChange('cobertor');
    expect(component.filteredData().map((i) => i.id)).toEqual(['3']);

    component.onFilterChange('categoria', '');
    component.onSearchChange('');
    expect(component.filteredData().length).toBe(3);
  });

  it('should paginate filtered data and update first on onPageChange', () => {
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('rows', 2);
    fixture.detectChanges();

    expect(component.paginatedData().map((i) => i.id)).toEqual(['1', '2']);
    expect(fixture.nativeElement.querySelectorAll('.grid-card').length).toBe(2);

    component.onPageChange({ first: 2, rows: 2 });
    fixture.detectChanges();

    expect(component.first()).toBe(2);
    expect(component.paginatedData().map((i) => i.id)).toEqual(['3']);
    expect(fixture.nativeElement.querySelectorAll('.grid-card').length).toBe(1);
  });

  it('should evaluate cardActions visibility, toggle menu, and emit cardAction on command', () => {
    const actions: IGridAction<MockGridItem>[] = [
      { label: 'Editar', icon: 'fa-solid fa-pen', actionId: 'edit' },
      {
        label: 'Excluir',
        icon: 'fa-solid fa-trash',
        actionId: 'delete',
        visibleFn: (item) => item.quantidade > 0,
      },
    ];
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('cardActions', actions);
    fixture.detectChanges();

    expect(component.hasVisibleActions(mockItems[0])).toBeTrue();
    expect(fixture.nativeElement.querySelectorAll('.action-menu-icon').length).toBe(3);

    const mockMenu = { toggle: jasmine.createSpy('toggle') } as unknown as Menu;
    const clickEvent = new MouseEvent('click');
    const stopSpy = spyOn(clickEvent, 'stopPropagation');
    const actionSpy = jasmine.createSpy('cardAction');
    component.cardAction.subscribe(actionSpy);

    component.toggleMenu(clickEvent, mockItems[1], mockMenu);

    expect(stopSpy).toHaveBeenCalled();
    expect(mockMenu.toggle).toHaveBeenCalledOnceWith(clickEvent);
    expect(component.activeMenuItems.length).toBe(1);
    expect(component.activeMenuItems[0].label).toBe('Editar');

    component.activeMenuItems[0].command?.({});
    expect(actionSpy).toHaveBeenCalledOnceWith({ action: 'edit', data: mockItems[1] });
  });

  it('should hide action button when no actions are visible for an item', () => {
    const actions: IGridAction<MockGridItem>[] = [
      {
        label: 'Apenas com estoque',
        icon: 'fa-solid fa-check',
        actionId: 'stock',
        visibleFn: (item) => item.quantidade > 0,
      },
    ];
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('cardActions', actions);
    fixture.detectChanges();

    expect(component.hasVisibleActions(mockItems[1])).toBeFalse();
    expect(fixture.nativeElement.querySelectorAll('.action-menu-icon').length).toBe(2);
  });
});
