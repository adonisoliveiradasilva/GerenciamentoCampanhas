import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Menu } from 'primeng/menu';
import { ITableAction, Table } from './table';
import { ITableColumn } from '../../../domains/table/models/table.model';

interface MockRow {
  id: string;
  name: string;
  status: string;
  statusColor?: 'success' | 'purple' | 'warning' | 'neutral' | 'danger';
  statusIcon?: string;
  createdAt: Date;
  avatarUrl?: string | null;
}

describe('Table', () => {
  let component: Table<MockRow>;
  let fixture: ComponentFixture<Table<MockRow>>;

  const mockColumns: ITableColumn<MockRow>[] = [
    { field: 'avatarUrl', header: 'Foto', type: 'avatar', avatarInitialsField: 'name' },
    { field: 'name', header: 'Nome', type: 'text' },
    {
      field: 'status',
      header: 'Status',
      type: 'badge',
      badgeClassField: 'statusColor',
      badgeIconField: 'statusIcon',
    },
    { field: 'createdAt', header: 'Criado em', type: 'date' },
  ];

  const mockRows: MockRow[] = [
    {
      id: '1',
      name: 'Ana Paula',
      status: 'Ativo',
      statusColor: 'success',
      statusIcon: 'fa-solid fa-check',
      createdAt: new Date(2025, 2, 15, 12, 0, 0),
      avatarUrl: 'https://example.com/ana.png',
    },
    {
      id: '2',
      name: 'Bruno Costa',
      status: 'Pendente',
      createdAt: new Date(2025, 10, 5, 12, 0, 0),
      avatarUrl: null,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table],
      providers: [provideZonelessChangeDetection(), provideAnimationsAsync('noop')],
    }).compileComponents();

    fixture = TestBed.createComponent(Table<MockRow>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockRows);
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.detectChanges();
  });

  it('should create and show loading state by default', () => {
    expect(component).toBeTruthy();
    expect(component.isLoading()).toBeTrue();
    expect(fixture.nativeElement.querySelector('lumen-loading')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('p-table')).toBeNull();
  });

  it('should render header, emit createAction, and toggle header/search/tabs visibility', () => {
    fixture.componentRef.setInput('title', 'Usuários');
    fixture.componentRef.setInput('createButtonLabel', 'Novo Usuário');
    fixture.componentRef.setInput('hasTabs', true);
    fixture.detectChanges();

    const tableContent: HTMLElement = fixture.nativeElement.querySelector('.table-content');
    expect(tableContent.style.borderTopLeftRadius).toBe('0px');
    expect(fixture.nativeElement.querySelector('lumen-page-header').textContent).toContain('Usuários');

    const createSpy = jasmine.createSpy('createAction');
    component.createAction.subscribe(createSpy);

    const createBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.table-content-header lumen-button button');
    createBtn.click();
    expect(createSpy).toHaveBeenCalledTimes(1);

    fixture.componentRef.setInput('showHeader', false);
    fixture.componentRef.setInput('showSearch', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.table-content-header')).toBeNull();
    expect(fixture.nativeElement.querySelector('lumen-search-input')).toBeNull();
  });

  it('should render empty feedback state when not loading and data is empty', () => {
    fixture.componentRef.setInput('data', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('emptyMessage', 'Nenhum usuário encontrado.');
    fixture.detectChanges();

    const feedback = fixture.nativeElement.querySelector('lumen-feedback-state');
    expect(feedback).toBeTruthy();
    expect(feedback.textContent).toContain('Nenhum usuário encontrado.');
    expect(fixture.nativeElement.querySelector('p-table')).toBeNull();
  });

  it('should render PrimeNG table with headers and text, badge, date, and avatar cells', () => {
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const headers: NodeListOf<HTMLTableCellElement> = fixture.nativeElement.querySelectorAll('thead th');
    expect(headers.length).toBe(4);
    expect(headers[0].classList.contains('is-avatar-col')).toBeTrue();
    expect(headers[1].textContent?.trim()).toBe('Nome');

    const rows: NodeListOf<HTMLTableRowElement> = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);

    const firstRowCells = rows[0].querySelectorAll('td');
    expect(firstRowCells[0].querySelector('lumen-avatar')).toBeTruthy();
    expect(firstRowCells[1].textContent?.trim()).toBe('Ana Paula');
    expect(firstRowCells[2].querySelector('lumen-badge')?.textContent?.trim()).toBe('Ativo');
    expect(firstRowCells[3].textContent?.trim()).toBe('15/03/2025');

    const secondRowCells = rows[1].querySelectorAll('td');
    expect(secondRowCells[1].textContent?.trim()).toBe('Bruno Costa');
    expect(secondRowCells[2].querySelector('lumen-badge')?.textContent?.trim()).toBe('Pendente');
    expect(secondRowCells[3].textContent?.trim()).toBe('05/11/2025');
  });

  it('should extract image URL and avatar label safely in helper methods', () => {
    expect(component.getImageUrl(mockRows[0], 'avatarUrl')).toBe('https://example.com/ana.png');
    expect(component.getImageUrl(mockRows[1], 'avatarUrl')).toBeNull();
    expect(component.getImageUrl(mockRows[0], 'createdAt')).toBeNull();
    expect(component.getImageUrl(mockRows[0], '')).toBeNull();
    expect(component.getImageUrl(null as unknown as MockRow, 'avatarUrl')).toBeNull();

    expect(component.getAvatarLabel(mockRows[0], 'name')).toBe('Ana Paula');
    expect(component.getAvatarLabel(mockRows[0], 'createdAt')).toBe('');
    expect(component.getAvatarLabel(mockRows[0], undefined)).toBe('');
    expect(component.getAvatarLabel(null as unknown as MockRow, 'name')).toBe('');
  });

  it('should render row actions column, filter visible actions, and emit rowAction via menu command', () => {
    const actions: ITableAction<MockRow>[] = [
      { label: 'Editar', icon: 'fa-solid fa-pen', actionId: 'edit' },
      {
        label: 'Desativar',
        icon: 'fa-solid fa-ban',
        actionId: 'deactivate',
        visibleFn: (row) => row.status === 'Ativo',
      },
    ];
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('rowActions', actions);
    fixture.componentRef.setInput('actionsHeaderText', 'Gerenciar');
    fixture.detectChanges();

    const headers: NodeListOf<HTMLTableCellElement> = fixture.nativeElement.querySelectorAll('thead th');
    expect(headers.length).toBe(5);
    expect(headers[4].textContent?.trim()).toBe('Gerenciar');

    expect(component.hasVisibleActions(mockRows[0])).toBeTrue();
    expect(component.hasVisibleActions(mockRows[1])).toBeTrue();

    const mockMenu = { toggle: jasmine.createSpy('toggle') } as unknown as Menu;
    const event = new MouseEvent('click');
    const rowActionSpy = jasmine.createSpy('rowAction');
    component.rowAction.subscribe(rowActionSpy);

    component.toggleMenu(event, mockRows[1], mockMenu);

    expect(mockMenu.toggle).toHaveBeenCalledOnceWith(event);
    expect(component.activeMenuItems.length).toBe(1);
    expect(component.activeMenuItems[0].label).toBe('Editar');

    component.activeMenuItems[0].command?.({});
    expect(rowActionSpy).toHaveBeenCalledOnceWith({ action: 'edit', data: mockRows[1] });
  });

  it('should filter PrimeNG table globally and update hasSearchResults', async () => {
    // When loading, primeTable() is undefined and filterTable should safely no-op
    expect(() => component.filterTable('Ana')).not.toThrow();

    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('globalFilterFields', ['name', 'status']);
    fixture.detectChanges();

    const primeTable = component.primeTable()!;
    const filterGlobalSpy = spyOn(primeTable, 'filterGlobal').and.callFake((value: any, matchMode: string) => {
      primeTable.filters['global'] = { value, matchMode };
      primeTable._filter();
    });

    component.filterTable('Ana');
    expect(filterGlobalSpy).toHaveBeenCalledOnceWith('Ana', 'contains');

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(component.hasSearchResults()).toBeTrue();

    component.filterTable('NaoExisteXYZ');
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(component.hasSearchResults()).toBeFalse();
  });
});
