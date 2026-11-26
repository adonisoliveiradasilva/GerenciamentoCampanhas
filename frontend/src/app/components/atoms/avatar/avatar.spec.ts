import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Avatar } from './avatar';

describe('Avatar', () => {
  let fixture: ComponentFixture<Avatar>;
  let component: Avatar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avatar],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Avatar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with default input values', () => {
    expect(component).toBeTruthy();
    expect(component.initials()).toBe('');
    expect(component.label()).toBe('');
    expect(component.imageUrl()).toBeNull();
    expect(component.size()).toBe('medium');
    expect(component.shape()).toBe('squircle');
    expect(component.imageFit()).toBe('cover');
    expect(component.imageError()).toBeFalse();
    expect(component.displayInitials()).toBe('');

    const container = (fixture.nativeElement as HTMLElement).querySelector('.squircle');
    expect(container?.classList.contains('medium')).toBeTrue();
    expect(container?.classList.contains('is-circle')).toBeFalse();
    expect(container?.classList.contains('has-image')).toBeFalse();
  });

  it('should display manual initials and prioritize them over label', () => {
    fixture.componentRef.setInput('label', 'Maria Silva');
    fixture.componentRef.setInput('initials', 'XY');
    fixture.detectChanges();

    expect(component.displayInitials()).toBe('XY');
    const initialsEl = (fixture.nativeElement as HTMLElement).querySelector('.avatar-initials');
    expect(initialsEl?.textContent?.trim()).toBe('XY');
  });

  it('should compute initials from multi-word label', () => {
    fixture.componentRef.setInput('label', '  joão   pedro  souza  ');
    fixture.detectChanges();

    expect(component.displayInitials()).toBe('JP');
    const initialsEl = (fixture.nativeElement as HTMLElement).querySelector('.avatar-initials');
    expect(initialsEl?.textContent?.trim()).toBe('JP');
  });

  it('should compute initials from single-word label', () => {
    fixture.componentRef.setInput('label', 'admin');
    fixture.detectChanges();

    expect(component.displayInitials()).toBe('AD');
    const initialsEl = (fixture.nativeElement as HTMLElement).querySelector('.avatar-initials');
    expect(initialsEl?.textContent?.trim()).toBe('AD');
  });

  it('should render image when imageUrl is provided and apply imageFit style', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/avatar.png');
    fixture.componentRef.setInput('imageFit', 'contain');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const container = el.querySelector('.squircle');
    const img = el.querySelector('img.avatar-image') as HTMLImageElement | null;

    expect(container?.classList.contains('has-image')).toBeTrue();
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://example.com/avatar.png');
    expect(img?.style.objectFit).toBe('contain');
    expect(el.querySelector('.avatar-initials')).toBeNull();
  });

  it('should fall back to initials when image fails to load', () => {
    fixture.componentRef.setInput('label', 'Ana Costa');
    fixture.componentRef.setInput('imageUrl', 'https://example.com/broken.png');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const img = el.querySelector('img.avatar-image') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(component.imageError()).toBeTrue();
    expect(el.querySelector('img.avatar-image')).toBeNull();
    expect(el.querySelector('.squircle')?.classList.contains('has-image')).toBeFalse();
    expect(el.querySelector('.avatar-initials')?.textContent?.trim()).toBe('AC');
  });

  it('should apply size and circle shape classes', () => {
    fixture.componentRef.setInput('size', 'xlarge');
    fixture.componentRef.setInput('shape', 'circle');
    fixture.detectChanges();

    const container = (fixture.nativeElement as HTMLElement).querySelector('.squircle');
    expect(container?.classList.contains('xlarge')).toBeTrue();
    expect(container?.classList.contains('is-circle')).toBeTrue();
  });
});
