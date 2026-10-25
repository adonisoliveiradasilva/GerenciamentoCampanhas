import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem } from '../../atoms/menu-item/menu-item';
import { IMenuNode } from '../../../domains/menu/models/menu.model';

@Component({
  selector: 'lumen-menu-group',
  standalone: true,
  imports: [MenuItem],
  templateUrl: './menu-group.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './menu-group.scss',
})
export class MenuGroup {
  groupData = input.required<IMenuNode>();
  isCollapsed = input<boolean | null>(false);
}