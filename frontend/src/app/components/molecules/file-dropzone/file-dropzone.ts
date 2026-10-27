import { Component, ChangeDetectionStrategy, input, output, signal, HostListener, viewChild, ElementRef } from '@angular/core';
import { Button } from '../../atoms/button/button';

@Component({
  selector: 'lumen-file-dropzone',
  standalone: true,
  imports: [Button],
  templateUrl: './file-dropzone.html',
  styleUrl: './file-dropzone.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileDropzone {
  public titleText = input.required<string>();
  public subtitleText = input.required<string>();
  public buttonText = input.required<string>();
  public icon = input<string>('fa-cloud-arrow-up');
  public accept = input<string>('*');
  public disabled = input<boolean>(false);
  public isLoading = input<boolean>(false);
  
  public onFileSelect = output<File>();
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
      this.validateAndEmit(files[0]);
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
      this.validateAndEmit(files[0]);
    }
    
    if (inputElement) inputElement.value = '';
  }

  private validateAndEmit(file: File): void {
    if (this.accept() !== '*') {
      const allowedExtensions = this.accept().split(',').map(ext => ext.trim().toLowerCase());
      const fileName = file.name.toLowerCase();
      
      const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));
      
      if (!isValid) {
        this.onInvalidFile.emit('bpm-node.TAB_VISUAL_UPLOAD_ERROR_EXTENSION');
        return;
      }
    }
    
    this.onFileSelect.emit(file);
  }
}