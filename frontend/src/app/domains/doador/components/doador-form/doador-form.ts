import { Component, ChangeDetectionStrategy, input, output, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

import { FullscreenModal } from '../../../../components/organisms/fullscreen-modal/fullscreen-modal';
import { InputComponent } from '../../../../components/atoms/input/input';
import { Button } from '../../../../components/atoms/button/button';
import { IDoadorVM } from '../../services/doador.service';

@Component({
  selector: 'app-doador-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FullscreenModal, InputComponent, Button],
  templateUrl: './doador-form.html',
  styleUrl: './doador-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoadorForm implements OnInit {
  private fb = inject(FormBuilder);

  doador = input<IDoadorVM | null>(null);
  fechar = output<void>();
  salvar = output<any>(); 

  form!: FormGroup;
  isEditMode = computed(() => !!this.doador());

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento: ['', [Validators.required, this.dataPassadaValidator]]
    });

    if (this.doador()) {
      const dataEdit = { ...this.doador()! };
      if (dataEdit.dataNascimento) dataEdit.dataNascimento = dataEdit.dataNascimento.split('T')[0];
      this.form.patchValue(dataEdit);
    }
  }
  
  private dataPassadaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const dataEscolhida = new Date(control.value + 'T00:00:00');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    return dataEscolhida > hoje ? { futureDate: true } : null;
  }

  get controls() { return this.form.controls; }

  getErrorMessage(fieldName: string): string {
    const control = this.controls[fieldName];
    if (control?.errors) {
      if (control.errors['required']) return 'Este campo é obrigatório.';
      if (control.errors['minlength']) return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres.`;
      if (control.errors['email']) return 'Informe um e-mail válido.';
      if (control.errors['futureDate']) return 'A data não pode ser no futuro.';
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