import { Component, ChangeDetectionStrategy, input, output, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FullscreenModal } from '../../../../components/organisms/fullscreen-modal/fullscreen-modal';
import { InputComponent } from '../../../../components/atoms/input/input';
import { Button } from '../../../../components/atoms/button/button';
import { ICampanhaVM } from '../../services/campanha.service';

@Component({
  selector: 'app-campanha-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FullscreenModal, InputComponent, Button],
  templateUrl: './campanha-form.html',
  styleUrl: './campanha-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampanhaForm implements OnInit {
  private fb = inject(FormBuilder);

  campanha = input<ICampanhaVM | null>(null);
  
  fechar = output<void>();
  salvar = output<any>(); 

  form!: FormGroup;
  isEditMode = computed(() => !!this.campanha());

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      local: ['', Validators.required],
      dataInicio: ['', Validators.required],
      
      dataFim: [''],
      descricao: [''] 
    });

    if (this.campanha()) {
      const dataEdit = { ...this.campanha()! };
      if (dataEdit.dataInicio) dataEdit.dataInicio = dataEdit.dataInicio.split('T')[0];
      if (dataEdit.dataFim) dataEdit.dataFim = dataEdit.dataFim.split('T')[0];
      this.form.patchValue(dataEdit);
    }
  }
  
  get controls() { return this.form.controls; }

  getErrorMessage(fieldName: string): string {
    const control = this.controls[fieldName];
    if (control?.errors) {
      if (control.errors['required']) return 'Este campo é obrigatório.';
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