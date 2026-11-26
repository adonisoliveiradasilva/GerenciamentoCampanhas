import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthLayout } from './auth-layout';

@Component({
  standalone: true,
  imports: [AuthLayout],
  template: `
    <auth-layout
      [txtWelcome]="welcome"
      [txtSubtitle]="subtitle"
      [txtSecurityBadge]="badge"
    >
      <form form-slot class="projected-form">Conteúdo do Formulário</form>
      <div class="unslotted">Não projetado</div>
    </auth-layout>
  `
})
class TestHostComponent {
  welcome = 'Bem-vindo ao <strong>Sistema</strong>';
  subtitle = 'Gerencie suas campanhas solidárias.';
  badge = 'Ambiente <em>seguro</em>';
}

describe('AuthLayout', () => {
  describe('componente isolado', () => {
    let component: AuthLayout;
    let fixture: ComponentFixture<AuthLayout>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AuthLayout],
        providers: [provideZonelessChangeDetection()]
      }).compileComponents();

      fixture = TestBed.createComponent(AuthLayout);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('txtWelcome', 'Olá, bem-vindo!');
      fixture.componentRef.setInput('txtSubtitle', 'Subtítulo de boas-vindas');
      fixture.componentRef.setInput('txtSecurityBadge', 'Conexão protegida');
      fixture.detectChanges();
    });

    it('deve ser criado', () => {
      expect(component).toBeTruthy();
    });

    it('deve renderizar os inputs obrigatórios no banner', () => {
      const el: HTMLElement = fixture.nativeElement;

      expect(el.querySelector('.banner-title')?.textContent).toContain('Olá, bem-vindo!');
      expect(el.querySelector('.banner-subtitle')?.textContent).toContain('Subtítulo de boas-vindas');
      expect(el.querySelector('.security-badge span')?.textContent).toContain('Conexão protegida');
    });

    it('deve renderizar os elementos estruturais e ícones do banner', () => {
      const el: HTMLElement = fixture.nativeElement;

      expect(el.querySelector('.auth-layout-wrapper')).toBeTruthy();
      expect(el.querySelector('.login-banner')).toBeTruthy();
      expect(el.querySelector('.login-form-area')).toBeTruthy();
      expect(el.querySelector('.fa-church')).toBeTruthy();
      expect(el.querySelector('.fa-hand-holding-heart')).toBeTruthy();
      expect(el.querySelector('.fa-shield')).toBeTruthy();
    });

    it('deve atualizar a visualização quando os inputs forem alterados', () => {
      fixture.componentRef.setInput('txtWelcome', 'Novo Título');
      fixture.componentRef.setInput('txtSubtitle', 'Novo Subtítulo');
      fixture.componentRef.setInput('txtSecurityBadge', 'Novo Selo');
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.banner-title')?.textContent).toContain('Novo Título');
      expect(el.querySelector('.banner-subtitle')?.textContent).toContain('Novo Subtítulo');
      expect(el.querySelector('.security-badge span')?.textContent).toContain('Novo Selo');
    });
  });

  describe('projeção de conteúdo e HTML', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
        providers: [provideZonelessChangeDetection()]
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();
    });

    it('deve projetar conteúdo com [form-slot] dentro de .login-form-area e ignorar conteúdo sem slot', () => {
      const el: HTMLElement = hostFixture.nativeElement;
      const formArea = el.querySelector('.login-form-area');

      expect(formArea?.querySelector('.projected-form')?.textContent).toContain('Conteúdo do Formulário');
      expect(el.querySelector('.unslotted')).toBeNull();
    });

    it('deve interpretar marcação HTML via innerHTML nos textos do banner', () => {
      const el: HTMLElement = hostFixture.nativeElement;

      expect(el.querySelector('.banner-title strong')?.textContent).toBe('Sistema');
      expect(el.querySelector('.security-badge em')?.textContent).toBe('seguro');
    });
  });
});
