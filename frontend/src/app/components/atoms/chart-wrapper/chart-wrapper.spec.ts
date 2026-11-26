import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartWrapper } from './chart-wrapper';

@Component({
  standalone: true,
  imports: [ChartWrapper],
  template: `
    <lumen-chart-wrapper
      [title]="title()"
      [height]="height()"
      [styleClass]="styleClass()"
      [isLoading]="isLoading()"
      [isEmpty]="isEmpty()"
      [emptyLabel]="emptyLabel()"
      [emptyIcon]="emptyIcon()"
    >
      <div class="mock-chart">Chart Content</div>
    </lumen-chart-wrapper>
  `,
})
class TestHostComponent {
  title = signal('Desempenho Mensal');
  height = signal('300px');
  styleClass = signal('');
  isLoading = signal(false);
  isEmpty = signal(false);
  emptyLabel = signal('Nenhum dado disponível para gerar o gráfico.');
  emptyIcon = signal('fa-chart-pie');
}

describe('ChartWrapper', () => {
  describe('standalone component', () => {
    let fixture: ComponentFixture<ChartWrapper>;
    let component: ChartWrapper;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChartWrapper],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(ChartWrapper);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('title', 'Vendas por Canal');
      fixture.detectChanges();
    });

    it('should create with required title and default inputs', () => {
      expect(component).toBeTruthy();
      expect(component.title()).toBe('Vendas por Canal');
      expect(component.height()).toBe('300px');
      expect(component.styleClass()).toBe('');
      expect(component.isLoading()).toBeFalse();
      expect(component.isEmpty()).toBeFalse();
      expect(component.emptyLabel()).toBe('Nenhum dado disponível para gerar o gráfico.');
      expect(component.emptyIcon()).toBe('fa-chart-pie');

      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.lumen-card-header h3')?.textContent?.trim()).toBe('Vendas por Canal');
      const container = el.querySelector('.chart-container') as HTMLElement;
      expect(container.style.height).toBe('300px');
    });

    it('should apply custom height and styleClass', () => {
      fixture.componentRef.setInput('height', '450px');
      fixture.componentRef.setInput('styleClass', 'dashboard-chart');
      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;
      const container = el.querySelector('.chart-container') as HTMLElement;
      const cardContainer = el.querySelector('.lumen-card-container');
      expect(container.style.height).toBe('450px');
      expect(cardContainer?.classList.contains('dashboard-chart')).toBeTrue();
    });
  });

  describe('projected content and states', () => {
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

    it('should project chart content inside .chart-container', () => {
      const el = hostFixture.nativeElement as HTMLElement;
      expect(el.querySelector('.chart-container .mock-chart')?.textContent?.trim()).toBe('Chart Content');
    });

    it('should forward loading state to lumen-card', () => {
      hostComponent.isLoading.set(true);
      hostFixture.detectChanges();

      const el = hostFixture.nativeElement as HTMLElement;
      expect(el.querySelector('lumen-loading')).toBeTruthy();
      expect(el.querySelector('.mock-chart')).toBeNull();
    });

    it('should forward empty state with label and icon to lumen-card', () => {
      hostComponent.isEmpty.set(true);
      hostComponent.emptyLabel.set('Sem dados no período');
      hostComponent.emptyIcon.set('fa-chart-bar');
      hostFixture.detectChanges();

      const el = hostFixture.nativeElement as HTMLElement;
      const feedback = el.querySelector('lumen-feedback-state');
      expect(feedback).toBeTruthy();
      expect(feedback?.querySelector('.empty-label')?.textContent?.trim()).toBe('Sem dados no período');
      expect(feedback?.querySelector('i')?.classList.contains('fa-chart-bar')).toBeTrue();
      expect(el.querySelector('.mock-chart')).toBeNull();
    });
  });
});
