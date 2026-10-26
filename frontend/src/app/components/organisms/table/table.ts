import { Component, ChangeDetectionStrategy, input, output, viewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, Table as PrimeNgTable } from 'primeng/table';
import { MenuModule, Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { SearchInput } from '../../atoms/search-input/search-input';
import { FeedbackState } from '../../molecules/feedback-state/feedback-state';
import { Loading } from '../../molecules/loading/loading';
import { Button } from '../../atoms/button/button';
import { ITableColumn } from '../../../domains/table/models/table.model';
import { PageHeader } from '../../atoms/page-header/page-header';
import { Badge } from '../../atoms/badge/badge';
import { Avatar } from '../../atoms/avatar/avatar';

export interface ITableAction<T = unknown> {
  label: string;
  icon: string;
  actionId: string;
  styleClass?: string;
  visibleFn?: (row: T) => boolean;
}

@Component({
  selector: 'lumen-table',
  standalone: true,
  imports: [PageHeader, CommonModule, TableModule, MenuModule, SearchInput, FeedbackState, Loading, Button, Badge, Avatar],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Table<T> { 
  data = input.required<T[]>();
  columns = input.required<ITableColumn<T>[]>();
  isLoading = input<boolean>(true);
  hasTabs = input<boolean>(false);
  showHeader = input<boolean>(true);
  showSearch = input<boolean>(true);
  
  title = input<string>('Listagem');
  showCreateButton = input<boolean>(true);
  createButtonLabel = input<string>('Novo Registro');
  createButtonIcon = input<string>('fa-plus');

  emptyMessage = input<string>('Nenhum registro encontrado.');
  searchPlaceholderText = input<string>('Pesquisar...');
  loadingText = input<string>('Carregando...');
  paginatorReportTemplate = input<string>('Mostrando {first} a {last} de {totalRecords} registros');
  actionsHeaderText = input<string>('Ações');
  optionsTooltipText = input<string>('Opções');
  noResultsText = input<string>('Nenhum resultado.');
  globalFilterFields = input<string[]>([]);

  rowActions = input<ITableAction<T>[]>([]);
  rowAction = output<{ action: string; data: T }>();
  createAction = output<void>();

  primeTable = viewChild<PrimeNgTable>('dt');
  public hasSearchResults = signal(true);

  public activeMenuItems: MenuItem[] = [];

  public hasVisibleActions(rowData: T): boolean {
    return this.rowActions().some(action => !action.visibleFn || action.visibleFn(rowData));
  }
  
  filterTable(searchTerm: string) {
    const tableInstance = this.primeTable();
    if (!tableInstance) return;

    tableInstance.filterGlobal(searchTerm, 'contains');

    setTimeout(() => {
        const filteredValue = tableInstance.filteredValue;
        this.hasSearchResults.set((filteredValue?.length ?? 0) > 0);
    });
  }

  public toggleMenu(event: Event, rowData: T, menu: Menu): void {
    const allowedActions = this.rowActions().filter(action => 
        !action.visibleFn || action.visibleFn(rowData)
    );

    this.activeMenuItems = allowedActions.map(action => ({
      label: action.label,
      icon: action.icon,
      styleClass: action.styleClass,
      command: () => this.rowAction.emit({ action: action.actionId, data: rowData })
    }));

    menu.toggle(event);
  }

  public getImageUrl(rowData: T, field: string): string | null | undefined {
    if (!rowData || !field) return null;
    const record = rowData as Record<string, unknown>;
    const value = record[field];
    return typeof value === 'string' ? value : null;
  }

  public getAvatarLabel(rowData: T, field?: string): string {
    if (!field || !rowData) return '';
    const record = rowData as Record<string, unknown>;
    const value = record[field];
    return typeof value === 'string' ? value : '';
  }
}