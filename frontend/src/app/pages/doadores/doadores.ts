import { Component, signal, computed, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, ITableAction } from '../../components/organisms/table/table';
import { ITableColumn } from '../../domains/table/models/table.model';
import { DoadoresLayout } from '../../components/templates/doadores-layout/doadores-layout';
import { DoadorForm } from '../../domains/doador/components/doador-form/doador-form';
import { DoadorService, IDoadorVM } from '../../domains/doador/services/doador.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../domains/toast/services/toast-service';
import { Loading } from '../../components/molecules/loading/loading';
import { ConfirmationModalService } from '../../domains/confirmation-modal/services/confirmation-modal';

@Component({
  selector: 'app-doadores',
  standalone: true,
  imports: [CommonModule, Table, DoadoresLayout, DoadorForm, Loading],
  host: { 'class': 'expand-host' },
  templateUrl: './doadores.html',
  styleUrl: './doadores.scss', 
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Doadores implements OnInit {
  private doadorService = inject(DoadorService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationModalService);

  public isLoading = signal<boolean>(true);
  public doadoresData = signal<IDoadorVM[]>([]);
  public isModalOpen = signal<boolean>(false);
  public doadorSelecionado = signal<IDoadorVM | null>(null);

  // Altere os campos de busca:
  public searchFields = signal<string[]>(['nome', 'idade', 'email']);

  // Adicione a coluna na tabela:
  public tableColumns = computed<ITableColumn<IDoadorVM>[]>(() => [
    { field: 'nome', header: 'Nome', type: 'text' },
    { field: 'email', header: 'E-mail', type: 'text' },
    { field: 'idade', header: 'Idade', type: 'text' },
    { field: 'dataNascimentoFormatada', header: 'Data Nasc.', type: 'text' }
  ]);

  public tableActions = computed<ITableAction<IDoadorVM>[]>(() => [
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

  private calcularIdade(isoString: string): number {
    if (!isoString) return 0;
    const hoje = new Date();
    const data = new Date(isoString);
    const dtNascimento = new Date(data.valueOf() + data.getTimezoneOffset() * 60 * 1000);
    
    let idade = hoje.getFullYear() - dtNascimento.getFullYear();
    const mes = hoje.getMonth() - dtNascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < dtNascimento.getDate())) {
      idade--;
    }
    
    return idade;
  }

  private carregarDadosDaApi(): void {
    this.isLoading.set(true);
    
    this.doadorService.getAll().subscribe({
      next: (apiData) => {
        const mappedData = apiData.map(doador => ({
          ...doador,
          idade: this.calcularIdade(doador.dataNascimento),
          dataNascimentoFormatada: this.formatarDataBr(doador.dataNascimento)
        }));
        
        this.doadoresData.set(mappedData);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error("Erro ao buscar doadores:", err);
        this.doadoresData.set([]);
        this.isLoading.set(false);
      }
    });
  }

  public onCreateNew(): void {
    this.doadorSelecionado.set(null);
    this.isModalOpen.set(true);
  }

  public handleRowAction(event: { action: string; data: IDoadorVM }): void {
    const { action, data } = event;
    
    if (action === 'edit') {
      this.doadorSelecionado.set(data);
      this.isModalOpen.set(true);
    } else if (action === 'delete') {
      this.confirmationService.open({
        title: 'Excluir Doador',
        subtitle: `Você está prestes a excluir ${data.nome}.`,
        message: 'Esta ação não pode ser desfeita.',
        type: 'danger',
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }).subscribe((confirmado) => {
        if (confirmado) this.excluirDoador(data.id);
      });
    }
  }

  private excluirDoador(id: string): void {
    this.isLoading.set(true);
    this.doadorService.delete(id).subscribe({
      next: () => {
        this.toastService.show('success', 'Doador excluído com sucesso.');
        this.carregarDadosDaApi();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        const msg = err.error?.erro || 'Erro ao excluir doador.';
        this.toastService.show('error', msg);
      }
    });
  }

  public fecharModal(): void {
    this.isModalOpen.set(false);
  }

  public salvarDoador(dadosDoForm: any): void {
    this.isLoading.set(true);

    if (dadosDoForm.id) {
      this.doadorService.update(dadosDoForm.id, dadosDoForm).subscribe({
        next: () => {
          this.isModalOpen.set(false);
          this.toastService.show('success', 'Doador atualizado com sucesso!');
          this.carregarDadosDaApi();
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          const msg = err.error?.erro || 'Erro ao editar doador.';
          this.toastService.show('error', msg);
        }
      });
    } else {
      this.doadorService.create(dadosDoForm).subscribe({
        next: () => {
          this.isModalOpen.set(false);
          this.toastService.show('success', 'Doador criado com sucesso!');
          this.carregarDadosDaApi();
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          const msg = err.error?.erro || 'Erro ao criar doador.';
          this.toastService.show('error', msg);
        }
      });
    }
  }
}