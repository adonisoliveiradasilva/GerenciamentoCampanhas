import { Component, signal, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { Avatar } from '../../atoms/avatar/avatar';
import { MenuModule, Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { IUserResponse } from '../../../domains/user/services/user.service';

@Component({
  selector: 'lumen-user-menu',
  standalone: true,
  imports: [Avatar, MenuModule],
  templateUrl: './user-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './user-menu.scss',
})
export class UserMenu {
  user = input.required<IUserResponse | null>();
  menuItems = input.required<MenuItem[]>();
  
  isOpen = signal(false);

  toggleMenu(event: Event, menu: Menu) {
    menu.toggle(event);
  }
}