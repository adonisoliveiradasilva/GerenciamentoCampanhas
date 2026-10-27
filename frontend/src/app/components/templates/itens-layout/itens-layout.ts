import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lumen-itens-layout',
  standalone: true,
  imports: [],
  host: { 'class': 'expand-host' },
  templateUrl: './itens-layout.html',
  styleUrl: './itens-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItensLayout { }