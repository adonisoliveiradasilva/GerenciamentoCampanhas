import { AfterViewInit, Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { Logo } from '../../atoms/logo/logo';
import { DateTime } from '../../atoms/date-time/date-time';
import { Button } from '../../atoms/button/button';
import { MenuGroup } from '../../molecules/menu-group/menu-group';

import { MENU_MOCK } from '../../../core/mocks/menu.mock';
import { SidebarService } from '../../../domains/sidebar/sidebar-service/sidebar-service';

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

  public isCollapsed = toSignal(this.sidebarService.isCollapsed$, { initialValue: false });
  public animationsReady = signal(false);
  
  public authorizedMenu = signal(MENU_MOCK); 

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