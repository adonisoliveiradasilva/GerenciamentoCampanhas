import { AfterViewInit, Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { Logo } from '../../atoms/logo/logo';
import { DateTime } from '../../atoms/date-time/date-time';
import { Button } from '../../atoms/button/button';
import { MenuGroup } from '../../molecules/menu-group/menu-group';

import { SidebarService } from '../../../domains/sidebar/sidebar-service/sidebar-service';
import { UserService } from '../../../domains/user/services/user.service';
import { getAppMenu } from '../../../core/mocks/menu.mock';

@Component({
  selector: 'lumen-sidebar',
  standalone: true,
  imports: [CommonModule, Logo, DateTime, MenuGroup, Button],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar implements AfterViewInit {
  private sidebarService = inject(SidebarService);
  private userService = inject(UserService);

  public isCollapsed = toSignal(this.sidebarService.isCollapsed$, { initialValue: false });
  public animationsReady = signal(false);
  
  public authorizedMenu = computed(() => {
    const role = this.userService.currentUser()?.role || '';
    return getAppMenu(role);
  }); 

  public mappedLocale = signal('pt-BR');

  public toggle(): void {
    this.sidebarService.toggle();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.animationsReady.set(true);
    }, 50);
  }
}