import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenModal } from '../../../../components/organisms/fullscreen-modal/fullscreen-modal';
import { Button } from '../../../../components/atoms/button/button';
import { IItemVM } from '../../services/item.service';

@Component({
  selector: 'app-historico-doacoes-modal',
  standalone: true,
  imports: [CommonModule, FullscreenModal, Button],
  templateUrl: './historico-doacoes-modal.html',
  styleUrl: './historico-doacoes-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoricoDoacoesModal {
  item = input.required<IItemVM>();
  fechar = output<void>();

  public formatarDataBr(isoString: string): string {
    if (!isoString) return '';
    const data = new Date(isoString);
    const dtDateOnly = new Date(data.valueOf() + data.getTimezoneOffset() * 60 * 1000);
    return dtDateOnly.toLocaleDateString('pt-BR');
  }
}