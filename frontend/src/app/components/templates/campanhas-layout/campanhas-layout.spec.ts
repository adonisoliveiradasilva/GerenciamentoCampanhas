import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampanhasLayout } from './campanhas-layout';

@Component({
  standalone: true,
  imports: [CampanhasLayout],
  template: `
    <lumen-campanhas-layout>
      <div campanhas-header-slot class="projected-header">Cabeçalho Campanhas</div>
      <section campanhas-content-slot class="projected-content">Lista de Campanhas</section>
      <p class="unslotted">Conteúdo fora do slot</p>
    </lumen-campanhas-layout>
  `
})
class TestHostComponent {}

describe('CampanhasLayout', () => {
  describe('componente isolado', () => {
    let component: CampanhasLayout;
    let fixture: ComponentFixture<CampanhasLayout>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CampanhasLayout],
        providers: [provideZonelessChangeDetection()]
      }).compileComponents();

      fixture = TestBed.createComponent(CampanhasLayout);
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

      expect(el.querySelector('.campanhas-page-container')).toBeTruthy();
      expect(el.querySelector('header.campanhas-page-header')).toBeTruthy();
      expect(el.querySelector('main.campanhas-page-content')).toBeTruthy();
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
      const header = el.querySelector('header.campanhas-page-header');
      const main = el.querySelector('main.campanhas-page-content');

      expect(header?.querySelector('.projected-header')?.textContent).toContain('Cabeçalho Campanhas');
      expect(main?.querySelector('.projected-content')?.textContent).toContain('Lista de Campanhas');
      expect(el.querySelector('.unslotted')).toBeNull();
    });
  });
});
