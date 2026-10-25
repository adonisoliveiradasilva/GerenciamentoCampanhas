import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lumen-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-fullscreen]': 'fullScreen()'
  }
})
export class Loading {
  label = input<string>('');
  fullScreen = input<boolean>(false);
}