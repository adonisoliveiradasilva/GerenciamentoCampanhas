import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardLayout } from './dashboard-layout';

@Component({
  standalone: true,
  imports: [DashboardLayout],
  template: `
    <lumen-dashboard-layout>
      <div dashboard-header-slot class="projected-header">Cabeçalho Dashboard</div>
      <section dashboard-content-slot class="projected-content">Gráficos e Métricas</section>
      <p class="unslotted">Conteúdo fora do slot</p>
    </lumen-dashboard-layout>
  `
})
class TestHostComponent {}

describe('DashboardLayout', () => {
  describe('componente isolado', () => {
    let component: DashboardLayout;
    let fixture: ComponentFixture<DashboardLayout>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DashboardLayout],
        providers: [provideZonelessChangeDetection()]
      }).compileComponents();

      fixture = TestBed.createComponent(DashboardLayout);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('deve ser criado', () => {
      expect(component).toBeTruthy();
    });

    it('deve aplicar a classe expand-host no elemento hospedeiro', () => {
      const hostEl: HTMLElement = fixture.nativeElement;
      expect(hostEl.classList.contains('expand-host')).toBeTrue();
    });

    it('deve renderizar a estrutura semântica de container, header e main', () => {
      const el: HTMLElement = fixture.nativeElement;

      expect(el.querySelector('.dashboard-page-container')).toBeTruthy();
      expect(el.querySelector('header.dashboard-page-header')).toBeTruthy();
      expect(el.querySelector('main.dashboard-page-content')).toBeTruthy();
    });
  });

  describe('projeção de conteúdo', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
        providers: [provideZonelessChangeDetection()]
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();
    });

    it('deve projetar os slots de cabeçalho e conteúdo nos respectivos elementos', () => {
      const el: HTMLElement = hostFixture.nativeElement;
      const header = el.querySelector('header.dashboard-page-header');
      const main = el.querySelector('main.dashboard-page-content');

      expect(header?.querySelector('.projected-header')?.textContent).toContain('Cabeçalho Dashboard');
      expect(main?.querySelector('.projected-content')?.textContent).toContain('Gráficos e Métricas');
      expect(el.querySelector('.unslotted')).toBeNull();
    });
  });
});
