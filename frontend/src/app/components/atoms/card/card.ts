import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Loading } from '../../molecules/loading/loading';
import { FeedbackState } from '../../molecules/feedback-state/feedback-state';

@Component({
  selector: 'lumen-card',
  standalone: true,
  imports: [CommonModule, Loading, FeedbackState],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Card {
  public title = input<string>();
  public padding = input<boolean>(true);
  public styleClass = input<string>('');

  public isLoading = input<boolean>(false);
  public loadingLabel = input<string>('Carregando...');
  
  public isEmpty = input<boolean>(false);
  public emptyLabel = input<string>('Nenhum dado encontrado.');
  public emptyIcon = input<string>('fa-box-open');
}