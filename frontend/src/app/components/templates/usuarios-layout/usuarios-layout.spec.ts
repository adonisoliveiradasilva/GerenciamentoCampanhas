import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosLayout } from './usuarios-layout';

@Component({
  standalone: true,
  imports: [UsuariosLayout],
  template: `
    <lumen-usuarios-layout>
      <div usuarios-header-slot class="projected-header">Cabeçalho Usuários</div>
      <section usuarios-content-slot class="projected-content">Tabela de Usuários</section>
      <p class="unslotted">Conteúdo fora do slot</p>
    </lumen-usuarios-layout>
  `
})
class TestHostComponent {}

describe('UsuariosLayout', () => {
  describe('componente isolado', () => {
    let component: UsuariosLayout;
    let fixture: ComponentFixture<UsuariosLayout>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [UsuariosLayout],
        providers: [provideZonelessChangeDetection()]
      }).compileComponents();

      fixture = TestBed.createComponent(UsuariosLayout);
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

      expect(el.querySelector('.usuarios-page-container')).toBeTruthy();
      expect(el.querySelector('header.usuarios-page-header')).toBeTruthy();
      expect(el.querySelector('main.usuarios-page-content')).toBeTruthy();
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
      const header = el.querySelector('header.usuarios-page-header');
      const main = el.querySelector('main.usuarios-page-content');

      expect(header?.querySelector('.projected-header')?.textContent).toContain('Cabeçalho Usuários');
      expect(main?.querySelector('.projected-content')?.textContent).toContain('Tabela de Usuários');
      expect(el.querySelector('.unslotted')).toBeNull();
    });
  });
});
