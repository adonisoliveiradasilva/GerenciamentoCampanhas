import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../card/card';

@Component({
  selector: 'lumen-chart-wrapper',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './chart-wrapper.html',
  styleUrl: './chart-wrapper.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartWrapper {
  public title = input.required<string>();
  public height = input<string>('300px'); 
  public styleClass = input<string>('');

  public isLoading = input<boolean>(false);
  public isEmpty = input<boolean>(false);
  public emptyLabel = input<string>('Nenhum dado disponível para gerar o gráfico.');
  public emptyIcon = input<string>('fa-chart-pie');
}