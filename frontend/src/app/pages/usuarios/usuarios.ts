import { Component, signal, computed, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, ITableAction } from '../../components/organisms/table/table';
import { ITableColumn } from '../../domains/table/models/table.model';
import { UsuariosLayout } from '../../components/templates/usuarios-layout/usuarios-layout';
import { UsuarioForm } from '../../domains/user/components/usuario-form/usuario-form';
import { UserService } from '../../domains/user/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../domains/toast/services/toast-service';
import { Loading } from '../../components/molecules/loading/loading';
import { ConfirmationModalService } from '../../domains/confirmation-modal/services/confirmation-modal';

export interface IUsuarioVM {
  id: string;
  nome: string;
  email: string;
  status: string;
  statusLabel: string;
  statusCss: string;
  statusIcon: string;
  dataCriacao: Date;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, Table, UsuariosLayout, UsuarioForm, Loading],
  host: { 'class': 'expand-host' },
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Usuarios implements OnInit {
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationModalService);

  public isLoading = signal<boolean>(true);
  public searchFields = signal<string[]>(['nome', 'email', 'perfil']);
  public usuariosData = signal<IUsuarioVM[]>([]);
  public isModalOpen = signal<boolean>(false);
  public usuarioSelecionado = signal<IUsuarioVM | null>(null);

  private idUsuarioLogado = computed(() => this.userService.currentUser()?.id);

  public tableColumns = computed<ITableColumn<IUsuarioVM>[]>(() => [
    { field: 'nome', header: 'Nome', type: 'text' },
    { field: 'email', header: 'E-mail', type: 'text' },
    { field: 'perfil', header: 'Perfil', type: 'text' },
    { field: 'statusLabel', header: 'Status', type: 'badge', badgeClassField: 'statusCss', badgeIconField: 'statusIcon' },
    { field: 'dataCriacao', header: 'Data de Criação', type: 'date' }
  ]);

  public tableActions = computed<ITableAction<IUsuarioVM>[]>(() => [
    {
      label: 'Editar',
      icon: 'fa-solid fa-pencil',
      actionId: 'edit',
      visibleFn: (row) => row.id !== this.idUsuarioLogado()
    },
    {
      label: 'Excluir',
      icon: 'fa-solid fa-trash-can',
      actionId: 'delete',
      styleClass: 'text-danger',
      visibleFn: (row) => row.id !== this.idUsuarioLogado()
    }
  ]);

  ngOnInit(): void {
    this.carregarDadosDaApi();
  }

  private carregarDadosDaApi(): void {
    this.isLoading.set(true);
    
    this.userService.getAll().subscribe({
      next: (apiData) => {
        const mappedData = apiData.map(usuario => {
          return {
            ...usuario,
            status: usuario.ativo ? 'ativo' : 'inativo',
            statusLabel: usuario.ativo ? 'Ativo' : 'Inativo',
            statusCss: usuario.ativo ? 'success' : 'danger',
            statusIcon: usuario.ativo ? 'fa-solid fa-check-circle' : 'fa-solid fa-ban'
          };
        });
        
        this.usuariosData.set(mappedData);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error("Erro ao buscar usuários:", err);
        this.usuariosData.set([]);
        this.isLoading.set(false);
      }
    });
  }

  public onCreateNew(): void {
    this.usuarioSelecionado.set(null);
    this.isModalOpen.set(true);
  }

  public handleRowAction(event: { action: string; data: IUsuarioVM }): void {
    const { action, data } = event;
    
    switch (action) {
      case 'edit':
        this.usuarioSelecionado.set(data);
        this.isModalOpen.set(true);
        break;
      
      case 'delete':
        this.confirmationService.open({
          title: 'Excluir Usuário',
          subtitle: `Você está prestes a excluir ${data.nome}.`,
          message: 'Esta ação não pode ser desfeita. O usuário perderá o acesso imediatamente.',
          type: 'danger',
          confirmText: 'Excluir',
          cancelText: 'Manter Usuário'
        }).subscribe((confirmado) => {
          if (confirmado) {
            this.excluirUsuario(data.id);
          }
        });
        break;
    }
  }

  private excluirUsuario(id: string): void {
    this.isLoading.set(true);
    
    this.userService.delete(id).subscribe({
      next: () => {
        this.toastService.show('success', 'Usuário excluído com sucesso.');
        this.carregarDadosDaApi();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        const msg = err.error?.erro || 'Erro ao excluir usuário.';
        this.toastService.show('error', msg);
      }
    });
  }

  public fecharModal(): void {
    this.isModalOpen.set(false);
  }

  public salvarUsuario(dadosDoForm: any): void {
    const payload = {
      ...dadosDoForm,
      ativo: dadosDoForm.status === 'ativo'
    };
    
    this.isLoading.set(true);

    if (dadosDoForm.id) {
      this.userService.update(dadosDoForm.id, payload).subscribe({
        next: () => {
          this.isModalOpen.set(false);
          this.toastService.show('success', 'Usuário atualizado com sucesso!');
          this.carregarDadosDaApi();
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          const msg = err.error?.erro || 'Erro ao editar usuário.';
          this.toastService.show('error', msg);
        }
      });
    } else {
      this.userService.create(payload).subscribe({
        next: () => {
          this.isModalOpen.set(false);
          this.toastService.show('success', 'Usuário criado com sucesso!');
          this.carregarDadosDaApi();
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          const msg = err.error?.erro || 'Erro ao criar usuário.';
          this.toastService.show('error', msg);
        }
      });
    }
  }
}