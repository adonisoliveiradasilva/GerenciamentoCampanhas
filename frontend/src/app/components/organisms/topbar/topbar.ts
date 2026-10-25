import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { UserMenu } from '../../molecules/user-menu/user-menu'; 

@Component({
  selector: 'lumen-topbar',
  standalone: true,
  imports: [UserMenu],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Topbar {
  private router = inject(Router);

  currentUser = signal({
    id: '123',
    name: 'Gestor Administrativo',
    email: 'gestor@doacoes.com',
  });

  userMenuConfig = computed<MenuItem[]>(() => {
    return [
      {
        label: 'Sair',
        icon: 'fa-solid fa-right-from-bracket',
        command: () => this.logout()
      }
    ];
  });

  logout() {
    localStorage.removeItem('auth_token');
    
    this.router.navigate(['/login']);
  }
}