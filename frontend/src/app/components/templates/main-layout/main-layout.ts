import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Sidebar } from '../../organisms/sidebar/sidebar';
import { Topbar } from '../../organisms/topbar/topbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lumen-main-layout',
  imports: [Sidebar, Topbar, RouterOutlet],
  templateUrl: './main-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './main-layout.scss',
})
export class MainLayout {

}
