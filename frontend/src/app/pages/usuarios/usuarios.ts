import { Component, signal, computed, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, ITableAction } from '../../components/organisms/table/table';
import { ITableColumn } from '../../domains/table/models/table.model';
import { UsuariosLayout } from '../../components/templates/usuarios-layout/usuarios-layout';
import { UsuarioForm } from '../../domains/usuarios/components/usuario-form/usuario-form';
import { UserService } from '../../domains/user/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  imports: [CommonModule, Table, UsuariosLayout, UsuarioForm],
  host: { 'class': 'expand-host' },
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Usuarios implements OnInit {
  private userService = inject(UserService);

  public isLoading = signal<boolean>(true);
  public searchFields = signal<string[]>(['nome', 'email', 'perfil']);
  public usuariosData = signal<IUsuarioVM[]>([]);
  public isModalOpen = signal<boolean>(false);
  public usuarioSelecionado = signal<IUsuarioVM | null>(null);

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
      visibleFn: () => true
    },
    {
      label: 'Desativar',
      icon: 'fa-solid fa-ban',
      actionId: 'deactivate',
      styleClass: 'text-warning',
      visibleFn: (row: IUsuarioVM) => row.status === 'ativo'
    },
    {
      label: 'Excluir',
      icon: 'fa-solid fa-trash-can',
      actionId: 'delete',
      styleClass: 'text-danger',
      visibleFn: () => true
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
      case 'deactivate':
        console.log('Desativar usuário:', data.nome);
        break;
      case 'delete':
        console.log('Excluir usuário:', data.nome);
        break;
    }
  }

  public fecharModal(): void {
    this.isModalOpen.set(false);
  }

  public salvarUsuario(dadosDoForm: any): void {
    console.log('Dados recebidos do form para salvar na API:', dadosDoForm);
    alert('Pronto para chamar o service/API!');
    this.isModalOpen.set(false);
  }
}