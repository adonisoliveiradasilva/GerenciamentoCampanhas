import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeusDadosLayout } from './meus-dados-layout';

@Component({
  standalone: true,
  imports: [MeusDadosLayout],
  template: `
    <lumen-meus-dados-layout>
      <div meus-dados-header-slot class="projected-header">Cabeçalho Meus Dados</div>
      <section meus-dados-content-slot class="projected-content">Formulário de Perfil</section>
      <p class="unslotted">Conteúdo fora do slot</p>
    </lumen-meus-dados-layout>
  `
})
class TestHostComponent {}

describe('MeusDadosLayout', () => {
  describe('componente isolado', () => {
    let component: MeusDadosLayout;
    let fixture: ComponentFixture<MeusDadosLayout>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MeusDadosLayout],
        providers: [provideZonelessChangeDetection()]
      }).compileComponents();

      fixture = TestBed.createComponent(MeusDadosLayout);
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

      expect(el.querySelector('.meus-dados-page-container')).toBeTruthy();
      expect(el.querySelector('header.meus-dados-page-header')).toBeTruthy();
      expect(el.querySelector('main.meus-dados-page-content')).toBeTruthy();
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
      const header = el.querySelector('header.meus-dados-page-header');
      const main = el.querySelector('main.meus-dados-page-content');

      expect(header?.querySelector('.projected-header')?.textContent).toContain('Cabeçalho Meus Dados');
      expect(main?.querySelector('.projected-content')?.textContent).toContain('Formulário de Perfil');
      expect(el.querySelector('.unslotted')).toBeNull();
    });
  });
});
