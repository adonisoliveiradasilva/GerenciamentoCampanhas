import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FileDropzone } from './file-dropzone';

describe('FileDropzone', () => {
  let component: FileDropzone;
  let fixture: ComponentFixture<FileDropzone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileDropzone],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(FileDropzone);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('titleText', 'Enviar Arquivo');
    fixture.componentRef.setInput('subtitleText', 'Arraste e solte aqui');
    fixture.componentRef.setInput('buttonText', 'Selecionar');
    fixture.detectChanges();
  });

  it('should create and render required text inputs and default icon', () => {
    expect(component).toBeTruthy();

    const title = fixture.nativeElement.querySelector('.dropzone-title');
    const subtitle = fixture.nativeElement.querySelector('.dropzone-subtitle');
    const icon = fixture.nativeElement.querySelector('.dropzone-icon');
    const button = fixture.nativeElement.querySelector('lumen-button button');

    expect(title.textContent.trim()).toBe('Enviar Arquivo');
    expect(subtitle.textContent.trim()).toBe('Arraste e solte aqui');
    expect(icon.classList.contains('fa-cloud-arrow-up')).toBeTrue();
    expect(button.textContent.trim()).toBe('Selecionar');
  });

  it('should apply disabled and skeleton classes and disable controls when disabled or loading', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const container: HTMLElement = fixture.nativeElement.querySelector('.dropzone-container');
    const fileInput: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('lumen-button button');

    expect(container.classList.contains('is-disabled')).toBeTrue();
    expect(fileInput.disabled).toBeTrue();
    expect(button.disabled).toBeTrue();

    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(container.classList.contains('is-disabled')).toBeFalse();
    expect(container.classList.contains('is-skeleton')).toBeTrue();
    expect(fileInput.disabled).toBeTrue();
    expect(button.disabled).toBeTrue();
  });

  it('should trigger click on hidden file input when enabled', () => {
    const fileInput: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    const clickSpy = spyOn(fileInput, 'click');

    component.triggerFileInput();

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('should NOT trigger file input click when disabled or loading', () => {
    const fileInput: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    const clickSpy = spyOn(fileInput, 'click');

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    component.triggerFileInput();

    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    component.triggerFileInput();

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should set isDragging on dragover and reset on dragleave', () => {
    const dragOverEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
    } as unknown as DragEvent;

    component.onDragOver(dragOverEvent);
    fixture.detectChanges();

    expect(dragOverEvent.preventDefault).toHaveBeenCalled();
    expect(dragOverEvent.stopPropagation).toHaveBeenCalled();
    expect(component.isDragging()).toBeTrue();
    expect(fixture.nativeElement.querySelector('.dropzone-container').classList.contains('is-dragging')).toBeTrue();

    const dragLeaveEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
    } as unknown as DragEvent;

    component.onDragLeave(dragLeaveEvent);
    fixture.detectChanges();

    expect(component.isDragging()).toBeFalse();
    expect(fixture.nativeElement.querySelector('.dropzone-container').classList.contains('is-dragging')).toBeFalse();
  });

  it('should NOT set isDragging on dragover when disabled or loading', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const dragOverEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
    } as unknown as DragEvent;

    component.onDragOver(dragOverEvent);
    expect(component.isDragging()).toBeFalse();
  });

  it('should emit onFileSelect when a valid file is chosen via handleFileChange', () => {
    const file = new File(['conteudo'], 'documento.pdf', { type: 'application/pdf' });
    const selectedSpy = jasmine.createSpy('onFileSelect');
    component.onFileSelect.subscribe(selectedSpy);

    const mockInput = {
      files: [file] as unknown as FileList,
      value: 'C:\\fakepath\\documento.pdf',
    };

    component.handleFileChange({ target: mockInput } as unknown as Event);

    expect(selectedSpy).toHaveBeenCalledOnceWith(file);
    expect(mockInput.value).toBe('');
  });

  it('should validate file extensions when accept is restricted', () => {
    fixture.componentRef.setInput('accept', '.pdf, .docx');
    fixture.detectChanges();

    const selectedSpy = jasmine.createSpy('onFileSelect');
    const invalidSpy = jasmine.createSpy('onInvalidFile');
    component.onFileSelect.subscribe(selectedSpy);
    component.onInvalidFile.subscribe(invalidSpy);

    const invalidFile = new File(['data'], 'imagem.png', { type: 'image/png' });
    component.handleFileChange({
      target: { files: [invalidFile] as unknown as FileList, value: 'imagem.png' },
    } as unknown as Event);

    expect(selectedSpy).not.toHaveBeenCalled();
    expect(invalidSpy).toHaveBeenCalledOnceWith('bpm-node.TAB_VISUAL_UPLOAD_ERROR_EXTENSION');

    const validFile = new File(['data'], 'RELATORIO.PDF', { type: 'application/pdf' });
    component.handleFileChange({
      target: { files: [validFile] as unknown as FileList, value: 'RELATORIO.PDF' },
    } as unknown as Event);

    expect(selectedSpy).toHaveBeenCalledOnceWith(validFile);
  });

  it('should emit dropped file on drop and ignore drop when disabled or loading', () => {
    const file = new File(['hello'], 'arquivo.txt', { type: 'text/plain' });
    const selectedSpy = jasmine.createSpy('onFileSelect');
    component.onFileSelect.subscribe(selectedSpy);

    component.isDragging.set(true);
    const dropEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
      dataTransfer: { files: [file] as unknown as FileList },
    } as unknown as DragEvent;

    component.onDrop(dropEvent);

    expect(component.isDragging()).toBeFalse();
    expect(selectedSpy).toHaveBeenCalledOnceWith(file);

    selectedSpy.calls.reset();
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    component.onDrop(dropEvent);

    expect(selectedSpy).not.toHaveBeenCalled();
  });
});
