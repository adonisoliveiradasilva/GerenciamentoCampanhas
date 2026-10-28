import { Component, ChangeDetectionStrategy, input, output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FullscreenModal } from '../../../../components/organisms/fullscreen-modal/fullscreen-modal';
import { InputComponent } from '../../../../components/atoms/input/input';
import { Button } from '../../../../components/atoms/button/button';
import { IItemVM } from '../../services/item.service';

@Component({
  selector: 'app-doacao-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FullscreenModal, InputComponent, Button],
  templateUrl: './doacao-form.html',
  styleUrl: './doacao-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoacaoForm implements OnInit {
  private fb = inject(FormBuilder);
  
  item = input.required<IItemVM>();
  fechar = output<void>();
  salvar = output<any>(); 

  form!: FormGroup;

  ngOnInit(): void {
    const estoqueMaximo = this.item().quantidade || 1;

    this.form = this.fb.group({
      quantidade: [1, [Validators.required, Validators.min(1), Validators.max(estoqueMaximo)]],
      dataDoacao: [new Date().toISOString().split('T')[0], Validators.required],
      destino: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  get controls() { return this.form.controls; }

  getErrorMessage(fieldName: string): string {
    const control = this.controls[fieldName];
    if (control?.errors) {
      if (control.errors['required']) return 'Este campo é obrigatório.';
      if (control.errors['min']) return `Doação mínima de ${control.errors['min'].min} unidade.`;
      if (control.errors['max']) return `Você só possui ${control.errors['max'].max} unidades no estoque.`;
      if (control.errors['minlength']) return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres.`;
    }
    return '';
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.salvar.emit(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }
}