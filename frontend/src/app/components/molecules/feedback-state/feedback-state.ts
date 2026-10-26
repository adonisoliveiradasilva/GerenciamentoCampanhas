import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StateType = 'success' | 'error' | 'warning' | 'info' | 'empty';

@Component({
  selector: 'lumen-feedback-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './feedback-state.scss'
})
export class FeedbackState {
  icon = input<string>('fa-inbox'); 
  type = input<StateType>('empty');
  label = input<string>('Nenhum dado encontrado.');
}