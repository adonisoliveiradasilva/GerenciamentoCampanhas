import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { IMenuNode } from '../../../domains/menu/models/menu.model';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'lumen-menu-item',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './menu-item.scss',
})
export class MenuItem {
  itemData = input.required<IMenuNode>();
  
  isCollapsed = input<boolean | null>(false);
}