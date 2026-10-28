import { Component, ChangeDetectionStrategy, input, output, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { FullscreenModal } from '../../../../components/organisms/fullscreen-modal/fullscreen-modal';
import { InputComponent } from '../../../../components/atoms/input/input';
import { Button } from '../../../../components/atoms/button/button';
import { SelectMini } from '../../../../components/atoms/select-mini/select-mini';
import { Loading } from '../../../../components/molecules/loading/loading';
import { ImageUploader } from '../../../../components/molecules/image-uploader/image-uploader';
import { ToastService } from '../../../../domains/toast/services/toast-service';

import { IItemVM } from '../../services/item.service';
import { CampanhaService } from '../../../campanha/services/campanha.service';
import { DoadorService } from '../../../doador/services/doador.service';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FullscreenModal, InputComponent, Button, SelectMini, Loading, ImageUploader, DatePipe],
  templateUrl: './item-form.html',
  styleUrl: './item-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemForm implements OnInit {
  private fb = inject(FormBuilder);
  private campanhaService = inject(CampanhaService);
  private doadorService = inject(DoadorService);
  private toastService = inject(ToastService);

  item = input<IItemVM | null>(null);
  fechar = output<void>();
  salvar = output<any>(); 

  form!: FormGroup;
  isEditMode = computed(() => !!this.item());
  isDependenciesLoading = signal(true);

  campanhasOptions = signal<{label: string, value: string}[]>([]);
  doadoresOptions = signal<{label: string, value: string}[]>([]);

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.minLength(2)]],
      descricao: [''],
      quantidade: [1, [Validators.required, Validators.min(0)]], 
      dataChegada: ['', Validators.required],
      lugarPego: [''],
      horaPego: [''],
      campanhaId: ['', Validators.required],
      doadorId: [null],
      imagens: [[], [this.maxImagesValidator(5)]]
    });

    this.carregarDependencias();
  }

  private maxImagesValidator(max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (Array.isArray(value) && value.length > max) {
        return { maxImages: true };
      }
      return null;
    };
  }
  
  private carregarDependencias(): void {
    forkJoin({
      campanhas: this.campanhaService.getAll(),
      doadores: this.doadorService.getAll()
    }).pipe(
      finalize(() => this.isDependenciesLoading.set(false))
    ).subscribe({
      next: ({ campanhas, doadores }) => {
        const cOptions = campanhas.map(c => ({ label: c.nome, value: c.id }));
        this.campanhasOptions.set(cOptions);

        const dOptions = doadores.map(d => ({ label: `${d.nome} (${d.email})`, value: d.id }));
        this.doadoresOptions.set([{ label: 'Sem Doador Vinculado', value: '' }, ...dOptions]);

        this.preencherFormulario();
      },
      error: () => {
        this.toastService.show('error', 'Erro ao carregar campanhas e doadores.');
      }
    });
  }

  private preencherFormulario(): void {
    if (this.item()) {
      const dataEdit = { ...this.item()! };
      if (dataEdit.dataChegada) dataEdit.dataChegada = dataEdit.dataChegada.split('T')[0];
      if (dataEdit.horaPego && dataEdit.horaPego.includes('T')) {
          const parts = dataEdit.horaPego.split('T');
          if(parts.length > 1) {
              dataEdit.horaPego = parts[1].substring(0, 5); 
          }
      }
      if (!dataEdit.doadorId) dataEdit.doadorId = ''; 
      if (!dataEdit.imagens) dataEdit.imagens = [];
      
      this.form.patchValue(dataEdit);
    }
  }
  
  get controls() { return this.form.controls; }

  getErrorMessage(fieldName: string): string {
    const control = this.controls[fieldName];
    if (control?.errors) {
      if (control.errors['required']) return 'Este campo é obrigatório.';
      if (control.errors['minlength']) return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres.`;
      if (control.errors['min']) return `Valor mínimo: ${control.errors['min'].min}.`;
      if (control.errors['maxImages']) return 'Limite máximo de 5 imagens excedido.';
    }
    return '';
  }
  
  public handleInvalidImage(erro: string): void {
    this.toastService.show('error', erro);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const raw = this.form.getRawValue();
      if (raw.doadorId === '') raw.doadorId = null; 
      
      this.salvar.emit(raw);
    } else {
      this.form.markAllAsTouched();
    }
  }
}