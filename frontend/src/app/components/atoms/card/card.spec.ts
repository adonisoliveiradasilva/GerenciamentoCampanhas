import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Card } from './card';

@Component({
  standalone: true,
  imports: [Card],
  template: `
    <lumen-card
      [title]="title()"
      [padding]="padding()"
      [styleClass]="styleClass()"
      [isLoading]="isLoading()"
      [loadingLabel]="loadingLabel()"
      [isEmpty]="isEmpty()"
      [emptyLabel]="emptyLabel()"
      [emptyIcon]="emptyIcon()"
    >
      <p class="projected-content">Conteúdo do card</p>
    </lumen-card>
  `,
})
class TestHostComponent {
  title = signal<string | undefined>(undefined);
  padding = signal(true);
  styleClass = signal('');
  isLoading = signal(false);
  loadingLabel = signal('Carregando...');
  isEmpty = signal(false);
  emptyLabel = signal('Nenhum dado encontrado.');
  emptyIcon = signal('fa-box-open');
}

describe('Card', () => {
  describe('standalone component', () => {
    let fixture: ComponentFixture<Card>;
    let component: Card;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Card],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(Card);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create with default inputs', () => {
      expect(component).toBeTruthy();
      expect(component.title()).toBeUndefined();
      expect(component.padding()).toBeTrue();
      expect(component.styleClass()).toBe('');
      expect(component.isLoading()).toBeFalse();
      expect(component.loadingLabel()).toBe('Carregando...');
      expect(component.isEmpty()).toBeFalse();
      expect(component.emptyLabel()).toBe('Nenhum dado encontrado.');
      expect(component.emptyIcon()).toBe('fa-box-open');

      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.lumen-card-header')).toBeNull();
      expect(el.querySelector('.lumen-card-container')?.classList.contains('no-padding')).toBeFalse();
    });

    it('should render header title when title is set', () => {
      fixture.componentRef.setInput('title', 'Resumo de Campanhas');
      fixture.detectChanges();

      const header = (fixture.nativeElement as HTMLElement).querySelector('.lumen-card-header h3');
      expect(header?.textContent?.trim()).toBe('Resumo de Campanhas');
    });

    it('should toggle no-padding class and apply custom styleClass', () => {
      fixture.componentRef.setInput('padding', false);
      fixture.componentRef.setInput('styleClass', 'custom-card-class');
      fixture.detectChanges();

      const container = (fixture.nativeElement as HTMLElement).querySelector('.lumen-card-container');
      expect(container?.classList.contains('no-padding')).toBeTrue();
      expect(container?.classList.contains('custom-card-class')).toBeTrue();
    });
  });

  describe('content projection and states', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });

    it('should project content when neither loading nor empty', () => {
      const el = hostFixture.nativeElement as HTMLElement;
      expect(el.querySelector('.projected-content')?.textContent?.trim()).toBe('Conteúdo do card');
      expect(el.querySelector('lumen-loading')).toBeNull();
      expect(el.querySelector('lumen-feedback-state')).toBeNull();
    });

    it('should display loading component with custom label and prioritize it over empty and content', () => {
      hostComponent.isLoading.set(true);
      hostComponent.isEmpty.set(true);
      hostComponent.loadingLabel.set('Buscando registros...');
      hostFixture.detectChanges();

      const el = hostFixture.nativeElement as HTMLElement;
      expect(el.querySelector('lumen-loading')).toBeTruthy();
      expect(el.querySelector('lumen-loading')?.textContent?.trim()).toBe('Buscando registros...');
      expect(el.querySelector('lumen-feedback-state')).toBeNull();
      expect(el.querySelector('.projected-content')).toBeNull();
    });

    it('should display empty feedback state with custom label and icon when isEmpty is true', () => {
      hostComponent.isEmpty.set(true);
      hostComponent.emptyLabel.set('Sem campanhas');
      hostComponent.emptyIcon.set('fa-folder-open');
      hostFixture.detectChanges();

      const el = hostFixture.nativeElement as HTMLElement;
      const feedback = el.querySelector('lumen-feedback-state');
      expect(feedback).toBeTruthy();
      expect(feedback?.querySelector('.empty-label')?.textContent?.trim()).toBe('Sem campanhas');
      expect(feedback?.querySelector('i')?.classList.contains('fa-folder-open')).toBeTrue();
      expect(el.querySelector('.projected-content')).toBeNull();
    });
  });
});
