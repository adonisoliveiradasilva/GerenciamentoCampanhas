import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoadoresLayout } from './doadores-layout';

@Component({
  standalone: true,
  imports: [DoadoresLayout],
  template: `
    <lumen-doadores-layout>
      <div doadores-header-slot class="projected-header">Cabeçalho Doadores</div>
      <section doadores-content-slot class="projected-content">Tabela de Doadores</section>
      <p class="unslotted">Conteúdo fora do slot</p>
    </lumen-doadores-layout>
  `
})
class TestHostComponent {}

describe('DoadoresLayout', () => {
  describe('componente isolado', () => {
    let component: DoadoresLayout;
    let fixture: ComponentFixture<DoadoresLayout>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DoadoresLayout],
        providers: [provideZonelessChangeDetection()]
      }).compileComponents();

      fixture = TestBed.createComponent(DoadoresLayout);
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

      expect(el.querySelector('.doadores-page-container')).toBeTruthy();
      expect(el.querySelector('header.doadores-page-header')).toBeTruthy();
      expect(el.querySelector('main.doadores-page-content')).toBeTruthy();
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
      const header = el.querySelector('header.doadores-page-header');
      const main = el.querySelector('main.doadores-page-content');

      expect(header?.querySelector('.projected-header')?.textContent).toContain('Cabeçalho Doadores');
      expect(main?.querySelector('.projected-content')?.textContent).toContain('Tabela de Doadores');
      expect(el.querySelector('.unslotted')).toBeNull();
    });
  });
});
