import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Loading } from './loading';

describe('Loading', () => {
  let component: Loading;
  let fixture: ComponentFixture<Loading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loading],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Loading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with default inputs', () => {
    expect(component).toBeTruthy();
    expect(component.label()).toBe('');
    expect(component.fullScreen()).toBeFalse();
  });

  it('should render spinner icon without label when label is empty', () => {
    const spinner = fixture.nativeElement.querySelector('i.fa-circle-notch.fa-spin');
    const labelSpan = fixture.nativeElement.querySelector('span');

    expect(spinner).toBeTruthy();
    expect(labelSpan).toBeNull();
  });

  it('should render label text when label input is provided', () => {
    fixture.componentRef.setInput('label', 'Carregando dados...');
    fixture.detectChanges();

    const labelSpan = fixture.nativeElement.querySelector('span');
    expect(labelSpan).toBeTruthy();
    expect(labelSpan.textContent.trim()).toBe('Carregando dados...');
  });

  it('should apply fullscreen host class and overlay/box classes when fullScreen is true', () => {
    const hostEl: HTMLElement = fixture.nativeElement;
    const wrapper: HTMLElement = hostEl.querySelector('.loading-wrapper')!;
    const container: HTMLElement = hostEl.querySelector('.loading-state-container')!;

    expect(hostEl.classList.contains('is-fullscreen')).toBeFalse();
    expect(wrapper.classList.contains('overlay')).toBeFalse();
    expect(container.classList.contains('box')).toBeFalse();

    fixture.componentRef.setInput('fullScreen', true);
    fixture.detectChanges();

    expect(hostEl.classList.contains('is-fullscreen')).toBeTrue();
    expect(wrapper.classList.contains('overlay')).toBeTrue();
    expect(container.classList.contains('box')).toBeTrue();
  });
});
