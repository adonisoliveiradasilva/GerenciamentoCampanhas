import { Component, signal, computed, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, ITableAction } from '../../components/organisms/table/table';
import { ITableColumn } from '../../domains/table/models/table.model';
import { CampanhasLayout } from '../../components/templates/campanhas-layout/campanhas-layout';
import { CampanhaForm } from '../../domains/campanha/components/campanha-form/campanha-form';
import { CampanhaService, ICampanhaVM } from '../../domains/campanha/services/campanha.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../domains/toast/services/toast-service';
import { Loading } from '../../components/molecules/loading/loading';
import { ConfirmationModalService } from '../../domains/confirmation-modal/services/confirmation-modal';

@Component({
  selector: 'app-campanhas',
  standalone: true,
  imports: [CommonModule, Table, CampanhasLayout, CampanhaForm, Loading],
  host: { 'class': 'expand-host' },
  templateUrl: './campanhas.html',
  styleUrl: './campanhas.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Campanhas implements OnInit {
  private campanhaService = inject(CampanhaService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationModalService);

  public isLoading = signal<boolean>(true);
  public searchFields = signal<string[]>(['nome', 'local', 'anoLabel']);
  public campanhasData = signal<ICampanhaVM[]>([]);
  public isModalOpen = signal<boolean>(false);
  public campanhaSelecionada = signal<ICampanhaVM | null>(null);

  public tableColumns = computed<ITableColumn<ICampanhaVM>[]>(() => [
    { field: 'nome', header: 'Nome da Campanha', type: 'text' },
    { field: 'anoLabel', header: 'Ano', type: 'badge', badgeClassField: 'anoCss' },
    { field: 'dataInicioFormatada', header: 'Data de Início', type: 'text' },
    { field: 'dataFimFormatada', header: 'Data de Fim', type: 'text' }
  ]);

  public tableActions = computed<ITableAction<ICampanhaVM>[]>(() => [
    { label: 'Editar', icon: 'fa-solid fa-pencil', actionId: 'edit', visibleFn: () => true },
    { label: 'Excluir', icon: 'fa-solid fa-trash-can', actionId: 'delete', styleClass: 'text-danger', visibleFn: () => true }
  ]);

  ngOnInit(): void {
    this.carregarDadosDaApi();
  }

  private formatarDataBr(isoString: string): string {
    if (!isoString) return '';
    const data = new Date(isoString);
    const dtDateOnly = new Date(data.valueOf() + data.getTimezoneOffset() * 60 * 1000);
    return dtDateOnly.toLocaleDateString('pt-BR');
  }

  private carregarDadosDaApi(): void {
    this.isLoading.set(true);
    
    this.campanhaService.getAll().subscribe({
      next: (apiData) => {
        const mappedData = apiData.map(campanha => {
          const ano = new Date(campanha.dataInicio).getFullYear().toString();
          return {
            ...campanha,
            anoLabel: ano,
            anoCss: 'purple',
            dataInicioFormatada: this.formatarDataBr(campanha.dataInicio),
            dataFimFormatada: this.formatarDataBr(campanha.dataFim)
          };
        });
        
        this.campanhasData.set(mappedData);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error("Erro ao buscar campanhas:", err);
        this.campanhasData.set([]);
        this.isLoading.set(false);
      }
    });
  }

  public onCreateNew(): void {
    this.campanhaSelecionada.set(null);
    this.isModalOpen.set(true);
  }

  public handleRowAction(event: { action: string; data: ICampanhaVM }): void {
    const { action, data } = event;
    
    if (action === 'edit') {
      this.campanhaSelecionada.set(data);
      this.isModalOpen.set(true);
    } else if (action === 'delete') {
      this.confirmationService.open({
        title: 'Excluir Campanha',
        subtitle: `Você está prestes a excluir a campanha ${data.nome}.`,
        message: 'Esta ação não pode ser desfeita.',
        type: 'danger',
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }).subscribe((confirmado) => {
        if (confirmado) this.excluirCampanha(data.id);
      });
    }
  }

  private excluirCampanha(id: string): void {
    this.isLoading.set(true);
    this.campanhaService.delete(id).subscribe({
      next: () => {
        this.toastService.show('success', 'Campanha excluída com sucesso.');
        this.carregarDadosDaApi();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        const msg = err.error?.erro || 'Erro ao excluir campanha.';
        this.toastService.show('error', msg);
      }
    });
  }

  public fecharModal(): void {
    this.isModalOpen.set(false);
  }

  public salvarCampanha(dadosDoForm: any): void {
    this.isLoading.set(true);

    const payload = {
      ...dadosDoForm,
      dataFim: dadosDoForm.dataFim ? dadosDoForm.dataFim : null,
      descricao: dadosDoForm.descricao ? dadosDoForm.descricao : null
    };

    if (payload.id) {
      this.campanhaService.update(payload.id, payload).subscribe({
        next: () => {
          this.isModalOpen.set(false);
          this.toastService.show('success', 'Campanha atualizada com sucesso!');
          this.carregarDadosDaApi();
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          const msg = err.error?.erro || 'Erro ao editar campanha.';
          this.toastService.show('error', msg);
        }
      });
    } else {
      this.campanhaService.create(payload).subscribe({
        next: () => {
          this.isModalOpen.set(false);
          this.toastService.show('success', 'Campanha criada com sucesso!');
          this.carregarDadosDaApi();
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          const msg = err.error?.erro || 'Erro ao criar campanha.';
          this.toastService.show('error', msg);
        }
      });
    }
  }
}