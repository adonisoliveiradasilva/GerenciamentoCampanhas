import { Component, signal, computed, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { GridList, IGridAction, IGridFilter } from '../../components/organisms/grid-list/grid-list';
import { ItensLayout } from '../../components/templates/itens-layout/itens-layout';
import { ItemForm } from '../../domains/item/components/item-form/item-form';
import { DoacaoForm } from '../../domains/item/components/doacao-form/doacao-form';
import { ItemService, IItemVM, IDoacaoRequest } from '../../domains/item/services/item.service';
import { CampanhaService } from '../../domains/campanha/services/campanha.service';
import { DoadorService } from '../../domains/doador/services/doador.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../domains/toast/services/toast-service';
import { Loading } from '../../components/molecules/loading/loading';
import { ConfirmationModalService } from '../../domains/confirmation-modal/services/confirmation-modal';
import { HistoricoDoacoesModal } from '../../domains/item/components/historico-doacoes-modal/historico-doacoes-modal';

@Component({
  selector: 'app-itens',
  standalone: true,
  imports: [CommonModule, GridList, ItensLayout, ItemForm, DoacaoForm, HistoricoDoacoesModal, Loading],
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
  public isDoacaoModalOpen = signal<boolean>(false);
  public isHistoricoModalOpen = signal<boolean>(false);
  
  public itemSelecionado = signal<IItemVM | null>(null);

  public dynamicFilters = signal<IGridFilter[]>([]);

  public cardActions = computed<IGridAction<IItemVM>[]>(() => [
    { label: 'Registrar Doação', icon: 'fa-solid fa-hand-holding-heart', actionId: 'donate', visibleFn: (row) => (row.quantidade || 0) > 0 },
    { label: 'Histórico de Doações', icon: 'fa-solid fa-clock-rotate-left', actionId: 'history', visibleFn: (row) => (row.historicoDoacoes?.length || 0) > 0 },
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
            label: 'Status do Estoque',
            field: 'statusEstoque',
            options: [
              { label: 'Todos os Status', value: '' },
              { label: '100% Disponível', value: 'integral' },
              { label: 'Parcialmente Doado', value: 'parcial' },
              { label: 'Completamente Esgotado', value: 'esgotado' }
            ]
          },
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

  public formatarDataBr(isoString: string): string {
    if (!isoString) return '';
    const data = new Date(isoString);
    const dtDateOnly = new Date(data.valueOf() + data.getTimezoneOffset() * 60 * 1000);
    return dtDateOnly.toLocaleDateString('pt-BR');
  }

  private carregarDadosDaApi(): void {
    this.isLoading.set(true);
    
    this.itemService.getAll().subscribe({
      next: (apiData) => {
        const mappedData = apiData.map(item => {
          let status = 'integral';
          if (item.quantidade === 0) status = 'esgotado';
          else if (item.historicoDoacoes && item.historicoDoacoes.length > 0) status = 'parcial';

          return {
            ...item,
            dataChegadaFormatada: this.formatarDataBr(item.dataChegada),
            doadorNome: item.doadorNome || 'Não informado',
            statusEstoque: status
          };
        });
        
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
    } else if (action === 'donate') {
      this.itemSelecionado.set(data);
      this.isDoacaoModalOpen.set(true);
    } else if (action === 'history') {
      this.itemSelecionado.set(data);
      this.isHistoricoModalOpen.set(true);
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

  public fecharModal(): void { this.isModalOpen.set(false); }
  public fecharDoacaoModal(): void { this.isDoacaoModalOpen.set(false); }
  public fecharHistoricoModal(): void { this.isHistoricoModalOpen.set(false); }

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

  public salvarDoacao(dadosDaDoacao: any): void {
    this.isLoading.set(true);
    
    const payload: IDoacaoRequest = {
      itemId: this.itemSelecionado()!.id,
      ...dadosDaDoacao
    };

    this.itemService.registrarDoacao(payload).subscribe({
      next: () => {
        this.isDoacaoModalOpen.set(false);
        this.toastService.show('success', 'Doação registrada com sucesso!');
        this.carregarDadosDaApi(); 
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.toastService.show('error', err.error?.erro || 'Erro ao registrar doação.');
      }
    });
  }
}