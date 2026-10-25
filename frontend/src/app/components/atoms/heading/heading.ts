import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lumen-heading',
  imports: [],
  templateUrl: './heading.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './heading.scss',
})
export class Heading {
  title = input<string>();
  subtitle = input<string>();
}
