import { Component, ChangeDetectionStrategy, input, output, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FullscreenModal } from '../../../../components/organisms/fullscreen-modal/fullscreen-modal';
import { InputComponent } from '../../../../components/atoms/input/input';
import { Button } from '../../../../components/atoms/button/button';
import { SelectMini } from '../../../../components/atoms/select-mini/select-mini';
import { IUsuarioVM } from '../../../../pages/usuarios/usuarios';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FullscreenModal, InputComponent, Button, SelectMini],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsuarioForm implements OnInit {
  private fb = inject(FormBuilder);

  usuario = input<IUsuarioVM | null>(null);
  
  fechar = output<void>();
  salvar = output<any>(); 

  form!: FormGroup;

  isEditMode = computed(() => !!this.usuario());

  statusOptions = [
    { label: 'Ativo', value: 'ativo' },
    { label: 'Inativo', value: 'inativo' }
  ];

  perfilOptions = [
    { label: 'Administrador', value: 'Administrador' },
    { label: 'Diácono', value: 'Diacono' }
  ];

  ngOnInit(): void {
    const editando = !!this.usuario();

    this.form = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: editando }, [Validators.required, Validators.email]], 
      perfil: ['Diacono', Validators.required],
      status: ['ativo', Validators.required]
    });

    if (editando) {
      this.form.patchValue(this.usuario()!);
    }
  }
  
  get controls() {
    return this.form.controls;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.controls[fieldName];
    
    if (control?.errors) {
      if (control.errors['required']) return 'Este campo é obrigatório.';
      if (control.errors['email']) return 'Informe um e-mail válido.';
      if (control.errors['minlength']) {
        const min = control.errors['minlength'].requiredLength;
        return `Deve ter pelo menos ${min} caracteres.`;
      }
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