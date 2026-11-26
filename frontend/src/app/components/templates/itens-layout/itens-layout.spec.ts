import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItensLayout } from './itens-layout';

@Component({
  standalone: true,
  imports: [ItensLayout],
  template: `
    <lumen-itens-layout>
      <div itens-header-slot class="projected-header">Cabeçalho Itens</div>
      <section itens-content-slot class="projected-content">Catálogo de Itens</section>
      <p class="unslotted">Conteúdo fora do slot</p>
    </lumen-itens-layout>
  `
})
class TestHostComponent {}

describe('ItensLayout', () => {
  describe('componente isolado', () => {
    let component: ItensLayout;
    let fixture: ComponentFixture<ItensLayout>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ItensLayout],
        providers: [provideZonelessChangeDetection()]
      }).compileComponents();

      fixture = TestBed.createComponent(ItensLayout);
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

      expect(el.querySelector('.itens-page-container')).toBeTruthy();
      expect(el.querySelector('header.itens-page-header')).toBeTruthy();
      expect(el.querySelector('main.itens-page-content')).toBeTruthy();
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
      const header = el.querySelector('header.itens-page-header');
      const main = el.querySelector('main.itens-page-content');

      expect(header?.querySelector('.projected-header')?.textContent).toContain('Cabeçalho Itens');
      expect(main?.querySelector('.projected-content')?.textContent).toContain('Catálogo de Itens');
      expect(el.querySelector('.unslotted')).toBeNull();
    });
  });
});
