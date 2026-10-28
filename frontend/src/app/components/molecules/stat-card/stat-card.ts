import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../atoms/card/card';

@Component({
  selector: 'lumen-stat-card',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCard {
  public title = input.required<string>();
  public value = input.required<number | string>();
  public icon = input.required<string>(); 
  public theme = input<'primary' | 'success' | 'warn' | 'error' | 'info'>('primary'); 
  
  public isLoading = input<boolean>(false);
  public loadingLabel = input<string>('Carregando...'); 
}