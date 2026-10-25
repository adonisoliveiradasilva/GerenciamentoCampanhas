import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'lumen-link',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './link.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './link.scss'
})
export class Link {
  public text = input.required<string>();
  
  public to = input.required<string>();
  
  public isExternal = input<boolean>(false);
}