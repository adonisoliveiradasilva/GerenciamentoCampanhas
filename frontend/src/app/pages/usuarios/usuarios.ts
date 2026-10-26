import { Component, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, ITableAction } from '../../components/organisms/table/table';
import { ITableColumn } from '../../domains/table/models/table.model';
import { UsuariosLayout } from '../../components/templates/usuarios-layout/usuarios-layout';

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
  imports: [CommonModule, Table, UsuariosLayout],
  host: { 'class': 'expand-host' },
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Usuarios implements OnInit {
  public isLoading = signal<boolean>(true);
  public searchFields = signal<string[]>(['nome', 'email']);
  public usuariosData = signal<IUsuarioVM[]>([]);

  public tableColumns = computed<ITableColumn<IUsuarioVM>[]>(() => [
    { field: 'nome', header: 'Nome', type: 'text' },
    { field: 'email', header: 'E-mail', type: 'text' },
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
    this.carregarDadosMock();
  }

  private carregarDadosMock(): void {
    setTimeout(() => {
      this.usuariosData.set([
        {
          id: '11111111-1111-1111-1111-111111111111',
          nome: 'Adonis Oliveira',
          email: 'adonis.silva@aluno.ufop.edu.br',
          status: 'ativo',
          statusLabel: 'Ativo',
          statusCss: 'success',
          statusIcon: 'fa-solid fa-check-circle',
          dataCriacao: new Date(2026, 0, 1)
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          nome: 'Caique Leite',
          email: 'caique.leite@aluno.ufop.edu.br',
          status: 'ativo',
          statusLabel: 'Ativo',
          statusCss: 'success',
          statusIcon: 'fa-solid fa-check-circle',
          dataCriacao: new Date(2026, 0, 1)
        }
      ]);
      this.isLoading.set(false);
    }, 800);
  }

  public onCreateNew(): void {
    console.log('Abrir side-modal de criação (em breve)');
    alert('Side-modal de criação será aberto aqui!');
  }

  public handleRowAction(event: { action: string; data: IUsuarioVM }): void {
    const { action, data } = event;

    switch (action) {
      case 'edit':
        console.log('Editar usuário:', data.nome);
        alert(`Editar ${data.nome}`);
        break;
      case 'deactivate':
        console.log('Desativar usuário:', data.nome);
        break;
      case 'delete':
        console.log('Excluir usuário:', data.nome);
        break;
    }
  }
}