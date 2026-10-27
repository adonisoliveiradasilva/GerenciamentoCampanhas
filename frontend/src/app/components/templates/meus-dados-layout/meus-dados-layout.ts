import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lumen-meus-dados-layout',
  standalone: true,
  imports: [],
  host: { 'class': 'expand-host' },
  templateUrl: './meus-dados-layout.html',
  styleUrl: './meus-dados-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeusDadosLayout {

}