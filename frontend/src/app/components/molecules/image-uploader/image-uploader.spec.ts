import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ImageUploader } from './image-uploader';

describe('ImageUploader', () => {
  let component: ImageUploader;
  let fixture: ComponentFixture<ImageUploader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageUploader],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageUploader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with default inputs and no gallery when images is empty', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.dropzone-title').textContent.trim()).toBe('Anexar Imagem');
    expect(fixture.nativeElement.querySelector('.dropzone-icon').classList.contains('fa-camera')).toBeTrue();
    expect(fixture.nativeElement.querySelector('.image-gallery')).toBeNull();
  });

  it('should render image gallery thumbnails and remove buttons when images are provided', () => {
    fixture.componentRef.setInput('images', ['data:image/png;base64,AAA', 'data:image/png;base64,BBB']);
    fixture.detectChanges();

    const imgs = fixture.nativeElement.querySelectorAll('.image-thumbnail img');
    const removeBtns = fixture.nativeElement.querySelectorAll('.btn-remove-img');

    expect(imgs.length).toBe(2);
    expect(imgs[0].getAttribute('src')).toBe('data:image/png;base64,AAA');
    expect(imgs[1].getAttribute('src')).toBe('data:image/png;base64,BBB');
    expect(removeBtns.length).toBe(2);
  });

  it('should hide remove buttons and apply skeleton class when disabled or loading', () => {
    fixture.componentRef.setInput('images', ['data:image/png;base64,AAA']);
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.btn-remove-img')).toBeNull();
    expect(fixture.nativeElement.querySelector('.image-thumbnail').classList.contains('is-skeleton')).toBeTrue();

    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.btn-remove-img')).toBeNull();
  });

  it('should emit updated images array when removing an image', () => {
    fixture.componentRef.setInput('images', ['img-1', 'img-2', 'img-3']);
    fixture.detectChanges();

    const changeSpy = jasmine.createSpy('imagesChange');
    component.imagesChange.subscribe(changeSpy);

    const removeBtns: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.btn-remove-img');
    removeBtns[1].click();

    expect(changeSpy).toHaveBeenCalledOnceWith(['img-1', 'img-3']);
  });

  it('should NOT remove image when disabled or loading', () => {
    fixture.componentRef.setInput('images', ['img-1', 'img-2']);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const changeSpy = jasmine.createSpy('imagesChange');
    component.imagesChange.subscribe(changeSpy);

    component.removerImagem(0);
    expect(changeSpy).not.toHaveBeenCalled();
  });

  it('should emit onInvalidFile when total images would exceed maxImages', () => {
    fixture.componentRef.setInput('maxImages', 2);
    fixture.componentRef.setInput('images', ['existing-1']);
    fixture.detectChanges();

    const invalidSpy = jasmine.createSpy('onInvalidFile');
    const changeSpy = jasmine.createSpy('imagesChange');
    component.onInvalidFile.subscribe(invalidSpy);
    component.imagesChange.subscribe(changeSpy);

    const files = [
      new File(['a'], 'a.png', { type: 'image/png' }),
      new File(['b'], 'b.jpg', { type: 'image/jpeg' }),
    ] as unknown as FileList;

    component.handleFileChange({ target: { files, value: 'a.png' } } as unknown as Event);

    expect(invalidSpy).toHaveBeenCalledOnceWith('Você pode anexar no máximo 2 imagens por item.');
    expect(changeSpy).not.toHaveBeenCalled();
  });

  it('should emit onInvalidFile for unsupported file formats', () => {
    const invalidSpy = jasmine.createSpy('onInvalidFile');
    const changeSpy = jasmine.createSpy('imagesChange');
    component.onInvalidFile.subscribe(invalidSpy);
    component.imagesChange.subscribe(changeSpy);

    const badFile = new File(['txt'], 'documento.pdf', { type: 'application/pdf' });
    component.handleFileChange({
      target: { files: [badFile] as unknown as FileList, value: 'documento.pdf' },
    } as unknown as Event);

    expect(invalidSpy).toHaveBeenCalledOnceWith('O arquivo documento.pdf possui um formato inválido.');
    expect(changeSpy).toHaveBeenCalledOnceWith([]);
  });

  it('should read valid image files via FileReader and emit imagesChange', () => {
    fixture.componentRef.setInput('images', ['existing-img']);
    fixture.detectChanges();

    let callIndex = 0;
    spyOn(window, 'FileReader').and.callFake(function () {
      const idx = ++callIndex;
      const reader: any = {
        onload: null,
        readAsDataURL: () => {
          reader.onload?.({ target: { result: `data:image/png;base64,FILE_${idx}` } });
        },
      };
      return reader as FileReader;
    });

    const changeSpy = jasmine.createSpy('imagesChange');
    component.imagesChange.subscribe(changeSpy);

    const mockInput = {
      files: [
        new File(['1'], 'foto1.JPG', { type: 'image/jpeg' }),
        new File(['2'], 'foto2.webp', { type: 'image/webp' }),
      ] as unknown as FileList,
      value: 'foto1.JPG',
    };

    component.handleFileChange({ target: mockInput } as unknown as Event);

    expect(changeSpy).toHaveBeenCalledOnceWith([
      'existing-img',
      'data:image/png;base64,FILE_1',
      'data:image/png;base64,FILE_2',
    ]);
    expect(mockInput.value).toBe('');
  });

  it('should handle dragover, dragleave, and drop events', () => {
    const baseEvent = () =>
      ({
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation'),
      }) as unknown as DragEvent;

    component.onDragOver(baseEvent());
    expect(component.isDragging()).toBeTrue();

    component.onDragLeave(baseEvent());
    expect(component.isDragging()).toBeFalse();

    spyOn(window, 'FileReader').and.callFake(function () {
      const reader: any = {
        onload: null,
        readAsDataURL: () => {
          reader.onload?.({ target: { result: 'data:image/png;base64,DROPPED' } });
        },
      };
      return reader as FileReader;
    });

    const changeSpy = jasmine.createSpy('imagesChange');
    component.imagesChange.subscribe(changeSpy);

    component.isDragging.set(true);
    const dropEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
      dataTransfer: {
        files: [new File(['x'], 'drop.png', { type: 'image/png' })] as unknown as FileList,
      },
    } as unknown as DragEvent;

    component.onDrop(dropEvent);

    expect(component.isDragging()).toBeFalse();
    expect(changeSpy).toHaveBeenCalledOnceWith(['data:image/png;base64,DROPPED']);
  });

  it('should click hidden file input on triggerFileInput only when enabled', () => {
    const fileInput: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    const clickSpy = spyOn(fileInput, 'click');

    component.triggerFileInput();
    expect(clickSpy).toHaveBeenCalledTimes(1);

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    component.triggerFileInput();
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
