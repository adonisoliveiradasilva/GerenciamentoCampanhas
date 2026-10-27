import { Component, signal, computed, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { GridList, IGridAction, IGridFilter } from '../../components/organisms/grid-list/grid-list';
import { ItensLayout } from '../../components/templates/itens-layout/itens-layout';
import { ItemForm } from '../../domains/item/components/item-form/item-form';
import { ItemService, IItemVM } from '../../domains/item/services/item.service';
import { CampanhaService } from '../../domains/campanha/services/campanha.service';
import { DoadorService } from '../../domains/doador/services/doador.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../domains/toast/services/toast-service';
import { Loading } from '../../components/molecules/loading/loading';
import { ConfirmationModalService } from '../../domains/confirmation-modal/services/confirmation-modal';

@Component({
  selector: 'app-itens',
  standalone: true,
  imports: [CommonModule, GridList, ItensLayout, ItemForm, Loading],
  host: { 'class': 'expand-host' },
  templateUrl: './itens.html',
  styleUrl: './itens.scss', 
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Itens implements OnInit {
  private itemService = inject(ItemService);
  private campanhaService = inject(CampanhaService);
  private doadorService = inject(DoadorService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationModalService);

  public isLoading = signal<boolean>(true);
  public isFiltersLoading = signal<boolean>(true);

  public searchFields = signal<string[]>(['nome', 'campanhaNome', 'doadorNome']);
  
  public itensData = signal<IItemVM[]>([]);
  public isModalOpen = signal<boolean>(false);
  public itemSelecionado = signal<IItemVM | null>(null);

  public dynamicFilters = signal<IGridFilter[]>([]);

  public cardActions = computed<IGridAction<IItemVM>[]>(() => [
    { label: 'Editar', icon: 'fa-solid fa-pencil', actionId: 'edit', visibleFn: () => true },
    { label: 'Excluir', icon: 'fa-solid fa-trash-can', actionId: 'delete', styleClass: 'text-danger', visibleFn: () => true }
  ]);

  ngOnInit(): void {
    this.carregarDadosDaApi();
    this.carregarFiltros();
  }

  private carregarFiltros(): void {
    forkJoin({
      campanhas: this.campanhaService.getAll(),
      doadores: this.doadorService.getAll()
    }).pipe(
      finalize(() => this.isFiltersLoading.set(false))
    ).subscribe({
      next: ({ campanhas, doadores }) => {
        const filtros: IGridFilter[] = [
          {
            label: 'Campanhas',
            field: 'campanhaId',
            options: [
              { label: 'Todas as Campanhas', value: '' },
              ...campanhas.map(c => ({ label: c.nome, value: c.id }))
            ]
          },
          {
            label: 'Doadores',
            field: 'doadorId',
            options: [
              { label: 'Todos os Doadores', value: '' },
              ...doadores.map(d => ({ label: `${d.nome}`, value: d.id }))
            ]
          }
        ];
        this.dynamicFilters.set(filtros);
      }
    });
  }

  private formatarDataBr(isoString: string): string {
    if (!isoString) return '';
    const data = new Date(isoString);
    const dtDateOnly = new Date(data.valueOf() + data.getTimezoneOffset() * 60 * 1000);
    return dtDateOnly.toLocaleDateString('pt-BR');
  }

  private carregarDadosDaApi(): void {
    this.isLoading.set(true);
    
    this.itemService.getAll().subscribe({
      next: (apiData) => {
        const mappedData = apiData.map(item => ({
          ...item,
          dataChegadaFormatada: this.formatarDataBr(item.dataChegada),
          doadorNome: item.doadorNome || 'Não informado'
        }));
        this.itensData.set(mappedData);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.itensData.set([]);
        this.isLoading.set(false);
      }
    });
  }

  public onCreateNew(): void {
    this.itemSelecionado.set(null);
    this.isModalOpen.set(true);
  }

  public handleCardAction(event: { action: string; data: IItemVM }): void {
    const { action, data } = event;
    if (action === 'edit') {
      this.itemSelecionado.set(data);
      this.isModalOpen.set(true);
    } else if (action === 'delete') {
      this.confirmationService.open({
        title: 'Excluir Item',
        subtitle: `Você está prestes a excluir ${data.nome}.`,
        message: 'Esta ação não pode ser desfeita.',
        type: 'danger',
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }).subscribe((confirmado) => {
        if (confirmado) this.excluirItem(data.id);
      });
    }
  }

  private excluirItem(id: string): void {
    this.isLoading.set(true);
    this.itemService.delete(id).subscribe({
      next: () => {
        this.toastService.show('success', 'Item excluído com sucesso.');
        this.carregarDadosDaApi();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.toastService.show('error', err.error?.erro || 'Erro ao excluir item.');
      }
    });
  }

  public fecharModal(): void {
    this.isModalOpen.set(false);
  }

  public salvarItem(dadosDoForm: any): void {
    this.isLoading.set(true);
    const payload = {
      ...dadosDoForm,
      descricao: dadosDoForm.descricao ? dadosDoForm.descricao : null,
      lugarPego: dadosDoForm.lugarPego ? dadosDoForm.lugarPego : null,
      horaPego: dadosDoForm.horaPego ? dadosDoForm.horaPego : null
    };

    if (payload.id) {
      this.itemService.update(payload.id, payload).subscribe({
        next: () => {
          this.isModalOpen.set(false);
          this.toastService.show('success', 'Item atualizado com sucesso!');
          this.carregarDadosDaApi();
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.toastService.show('error', err.error?.erro || 'Erro ao editar item.');
        }
      });
    } else {
      this.itemService.create(payload).subscribe({
        next: () => {
          this.isModalOpen.set(false);
          this.toastService.show('success', 'Item cadastrado com sucesso!');
          this.carregarDadosDaApi();
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.toastService.show('error', err.error?.erro || 'Erro ao cadastrar item.');
        }
      });
    }
  }
}