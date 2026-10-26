import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lumen-usuarios-layout',
  standalone: true,
  imports: [],
  host: { 'class': 'expand-host' },
  templateUrl: './usuarios-layout.html',
  styleUrl: './usuarios-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsuariosLayout {

}