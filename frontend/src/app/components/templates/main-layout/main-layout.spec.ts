import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BehaviorSubject } from 'rxjs';
import { MainLayout } from './main-layout';
import { SidebarService } from '../../../domains/sidebar/sidebar-service/sidebar-service';
import { IUserResponse, UserService } from '../../../domains/user/services/user.service';

@Component({
  standalone: true,
  template: `<div class="child-route-page">Conteúdo da Rota Filha</div>`
})
class DummyChildPage {}

describe('MainLayout', () => {
  let component: MainLayout;
  let fixture: ComponentFixture<MainLayout>;
  let router: Router;
  let isCollapsedSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isCollapsedSubject = new BehaviorSubject<boolean>(false);

    const mockSidebarService = {
      isCollapsed$: isCollapsedSubject.asObservable(),
      toggle: jasmine.createSpy('toggle').and.callFake(() => {
        isCollapsedSubject.next(!isCollapsedSubject.value);
      })
    };

    const mockUserService = {
      currentUser: signal<IUserResponse | null>({
        id: '1',
        name: 'Administrador Teste',
        email: 'admin@ufop.edu.br',
        role: 'Administrador'
      })
    };

    await TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideAnimationsAsync('noop'),
        provideRouter([
          { path: 'filha', component: DummyChildPage }
        ]),
        { provide: SidebarService, useValue: mockSidebarService },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(MainLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar o shell principal com sidebar, topbar e router-outlet', () => {
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('.lumen-lumen-shell')).toBeTruthy();
    expect(el.querySelector('lumen-sidebar')).toBeTruthy();
    expect(el.querySelector('.lumen-lumen-shell-content')).toBeTruthy();
    expect(el.querySelector('lumen-topbar')).toBeTruthy();
    expect(el.querySelector('.page-content')).toBeTruthy();
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });

  it('deve exibir o componente da rota filha dentro de .page-content', async () => {
    await router.navigate(['/filha']);
    fixture.detectChanges();

    const pageContent = fixture.nativeElement.querySelector('.page-content');
    expect(pageContent?.querySelector('.child-route-page')?.textContent).toContain('Conteúdo da Rota Filha');
  });
});
