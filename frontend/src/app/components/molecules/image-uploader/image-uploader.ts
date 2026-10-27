import { Component, ChangeDetectionStrategy, input, output, signal, HostListener, viewChild, ElementRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../atoms/button/button';

@Component({
  selector: 'lumen-image-uploader',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './image-uploader.html',
  styleUrl: './image-uploader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploader {
  private cdr = inject(ChangeDetectorRef);

  public titleText = input<string>('Anexar Imagem');
  public subtitleText = input<string>('Arraste fotos ou clique para buscar no computador.');
  public buttonText = input<string>('Buscar Imagens');
  public icon = input<string>('fa-camera');
  public disabled = input<boolean>(false);
  public isLoading = input<boolean>(false);
  
  public images = input<string[]>([]);
  public imagesChange = output<string[]>();
  
  public onInvalidFile = output<string>();

  public fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  public isDragging = signal<boolean>(false);

  @HostListener('dragover', ['$event'])
  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled() && !this.isLoading()) {
      this.isDragging.set(true);
    }
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (this.disabled() || this.isLoading()) return;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFiles(files);
    }
  }

  public triggerFileInput(): void {
    if (!this.disabled() && !this.isLoading()) {
      this.fileInput()?.nativeElement.click();
    }
  }

  public handleFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    
    if (files && files.length > 0) {
      this.processFiles(files);
    }
    
    if (inputElement) inputElement.value = '';
  }

  private processFiles(files: FileList): void {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const currentImages = [...this.images()];
    let processedCount = 0;
    const totalFiles = files.length;

    Array.from(files).forEach(file => {
      const fileName = file.name.toLowerCase();
      const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));
      
      if (!isValid) {
        this.onInvalidFile.emit(`O arquivo ${file.name} possui um formato inválido.`);
        processedCount++;
        if (processedCount === totalFiles) this.updateImages(currentImages);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        currentImages.push(e.target.result);
        processedCount++;
        
        if (processedCount === totalFiles) {
          this.updateImages(currentImages);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  private updateImages(newImages: string[]): void {
    this.imagesChange.emit(newImages);
    this.cdr.markForCheck();
  }

  public removerImagem(index: number): void {
    if (this.disabled() || this.isLoading()) return;
    
    const currentImages = [...this.images()];
    currentImages.splice(index, 1);
    this.updateImages(currentImages);
  }
}