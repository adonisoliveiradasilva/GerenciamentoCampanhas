import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../components/atoms/input/input';
import { Button } from '../../components/atoms/button/button';
import { Heading } from '../../components/atoms/heading/heading';
import { Loading } from '../../components/molecules/loading/loading';
import { MeusDadosLayout } from '../../components/templates/meus-dados-layout/meus-dados-layout';
import { UserService } from '../../domains/user/services/user.service';
import { ToastService } from '../../domains/toast/services/toast-service';

@Component({
  selector: 'app-meus-dados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, Button, Heading, Loading, MeusDadosLayout],
  host: { 'class': 'expand-host' },
  templateUrl: './meus-dados.html',
  styleUrl: './meus-dados.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeusDados implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  public isLoading = signal<boolean>(false);
  
  public dadosForm!: FormGroup;
  public senhaForm!: FormGroup;

  ngOnInit(): void {
    const usuarioLogado = this.userService.getLoggedUser();

    this.dadosForm = this.fb.group({
      nome: [usuarioLogado?.name || '', [Validators.required, Validators.minLength(3)]],
      email: [{ value: usuarioLogado?.email || '', disabled: true }] 
    });

    this.senhaForm = this.fb.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
      ]],
      confirmarSenha: ['', Validators.required]
    });
  }

  get dadosControls() { return this.dadosForm.controls; }
  get senhaControls() { return this.senhaForm.controls; }

  get novaSenhaValue(): string {
    return this.senhaForm.get('novaSenha')?.value || '';
  }

  get temMinLength(): boolean { return this.novaSenhaValue.length >= 8; }
  get temMaiuscula(): boolean { return /[A-Z]/.test(this.novaSenhaValue); }
  get temNumero(): boolean { return /[0-9]/.test(this.novaSenhaValue); }
  get temEspecial(): boolean { return /[!@#$%^&*]/.test(this.novaSenhaValue); }
  get senhasConferem(): boolean {
    return this.novaSenhaValue === this.senhaForm.get('confirmarSenha')?.value && this.novaSenhaValue !== '';
  }

  public salvarDados(): void {
    if (this.dadosForm.invalid) {
      this.dadosForm.markAllAsTouched();
      return;
    }
    
    this.isLoading.set(true);
    
    const payload = {
      nome: this.dadosForm.get('nome')?.value
    };

    this.userService.updateMeusDados(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        
        this.userService.updateUserNameLocal(payload.nome);
        
        this.toastService.show('success', 'Dados atualizados com sucesso!');
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.erro || 'Erro ao atualizar dados.';
        this.toastService.show('error', msg);
      }
    });
  }

  public alterarSenha(): void {
    if (this.senhaForm.invalid || !this.senhasConferem) {
      this.senhaForm.markAllAsTouched();
      this.toastService.show('warning', 'Verifique os critérios da nova senha.');
      return;
    }
    
    this.isLoading.set(true);

    const payload = {
      senhaAtual: this.senhaForm.get('senhaAtual')?.value,
      novaSenha: this.senhaForm.get('novaSenha')?.value
    };

    this.userService.alterarSenha(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.senhaForm.reset();
        this.toastService.show('success', 'Sua senha foi alterada com segurança!');
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.erro || 'Erro ao alterar a senha. Verifique sua senha atual.';
        this.toastService.show('error', msg);
      }
    });
  }
  public getErrorMessage(formGroup: FormGroup, fieldName: string): string {
    const control = formGroup.get(fieldName);
    if (control?.errors) {
      if (control.errors['required']) return 'Este campo é obrigatório.';
      if (control.errors['minlength']) return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres.`;
      
      if (control.errors['pattern'] && fieldName === 'novaSenha') {
        const faltam = [];
        if (!this.temMaiuscula) faltam.push('letra maiúscula');
        if (!this.temNumero) faltam.push('número');
        if (!this.temEspecial) faltam.push('caractere especial');
        
        return `Falta: ${faltam.join(', ')}.`;
      }
    }
    return '';
  }
}