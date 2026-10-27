import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInput } from '../../atoms/search-input/search-input';
import { FeedbackState } from '../../molecules/feedback-state/feedback-state';
import { Loading } from '../../molecules/loading/loading';
import { Button } from '../../atoms/button/button';
import { PageHeader } from '../../atoms/page-header/page-header';
import { SelectMini } from '../../atoms/select-mini/select-mini';
import { MenuModule, Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { PaginatorModule, PaginatorState } from 'primeng/paginator'; 

export interface IGridAction<T = unknown> {
  label: string;
  icon: string;
  actionId: string;
  styleClass?: string;
  visibleFn?: (row: T) => boolean;
}

export interface IGridFilter {
    label: string;
    field: string;
    options: {label: string, value: string}[];
}

@Component({
  selector: 'lumen-grid-list',
  standalone: true,
  imports: [PageHeader, CommonModule, MenuModule, SearchInput, FeedbackState, Loading, Button, SelectMini, PaginatorModule], 
  templateUrl: './grid-list.html',
  styleUrl: './grid-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridList<T> { 
  data = input.required<T[]>();
  
  imageField = input<string>('imagens');
  titleField = input<string>('nome');
  subtitleField = input<string>('campanhaNome');
  dateField = input<string>('dataChegadaFormatada');
  badgeField = input<string>('quantidade');
  
  isLoading = input<boolean>(true);
  title = input<string>('Listagem');
  
  showCreateButton = input<boolean>(true);
  createButtonLabel = input<string>('Novo Registro');
  createButtonIcon = input<string>('fa-plus');

  emptyMessage = input<string>('Nenhum registro encontrado.');
  searchPlaceholderText = input<string>('Pesquisar...');
  
  paginatorReportTemplate = input<string>('Mostrando {first} a {last} de {totalRecords} registros');
  rows = input<number>(10);
  
  cardActions = input<IGridAction<T>[]>([]);
  cardAction = output<{ action: string; data: T }>();
  createAction = output<void>();

  globalFilterFields = input<string[]>([]);
  dropdownFilters = input<IGridFilter[]>([]);

  public searchTerm = signal<string>('');
  public activeFilters = signal<Record<string, string>>({});
  public currentImageIndices = signal<Record<string, number>>({});
  public activeMenuItems: MenuItem[] = [];

  public first = signal<number>(0);

  public onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.first.set(0); 
  }

  public onFilterChange(field: string, value: string): void {
    this.activeFilters.update(filters => ({
        ...filters,
        [field]: value
    }));
    this.first.set(0); 
  }

  public filteredData = computed(() => {
    let result = this.data() || [];
    
    const filters = this.activeFilters();
    Object.keys(filters).forEach(field => {
        const val = filters[field];
        if (val) {
            result = result.filter(item => {
                const record = item as any;
                return String(record[field]) === String(val);
            });
        }
    });

    const term = this.searchTerm().toLowerCase().trim();
    if (term && this.globalFilterFields().length > 0) {
        result = result.filter(item => {
            const record = item as any;
            return this.globalFilterFields().some(field => {
                const val = record[field];
                return val && String(val).toLowerCase().includes(term);
            });
        });
    }

    return result;
  });

  public paginatedData = computed(() => {
    const start = this.first();
    const end = start + this.rows();
    return this.filteredData().slice(start, end);
  });

  public onPageChange(event: PaginatorState) {
    this.first.set(event.first || 0);
  }

  public getImages(item: T): string[] {
      const record = item as any;
      const images = record[this.imageField()];
      return Array.isArray(images) && images.length > 0 ? images : [];
  }

  public getCurrentImageIndex(itemId: string): number {
      return this.currentImageIndices()[itemId] || 0;
  }

  public prevImage(event: Event, itemId: string, totalImages: number): void {
      event.stopPropagation();
      this.currentImageIndices.update(indices => {
          const current = indices[itemId] || 0;
          return { ...indices, [itemId]: current > 0 ? current - 1 : totalImages - 1 };
      });
  }

  public nextImage(event: Event, itemId: string, totalImages: number): void {
      event.stopPropagation();
      this.currentImageIndices.update(indices => {
          const current = indices[itemId] || 0;
          return { ...indices, [itemId]: current < totalImages - 1 ? current + 1 : 0 };
      });
  }

  public getProperty(item: T, field: string): any {
      return (item as any)[field];
  }

  public hasVisibleActions(rowData: T): boolean {
    return this.cardActions().some(action => !action.visibleFn || action.visibleFn(rowData));
  }

  public toggleMenu(event: Event, rowData: T, menu: Menu): void {
    event.stopPropagation();
    const allowedActions = this.cardActions().filter(action => 
        !action.visibleFn || action.visibleFn(rowData)
    );

    this.activeMenuItems = allowedActions.map(action => ({
      label: action.label,
      icon: action.icon,
      styleClass: action.styleClass,
      command: () => this.cardAction.emit({ action: action.actionId, data: rowData })
    }));

    menu.toggle(event);
  }
}