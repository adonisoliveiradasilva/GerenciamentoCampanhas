import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal, WritableSignal } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, Router } from '@angular/router';
import { Topbar } from './topbar';
import { IUserResponse, UserService } from '../../../domains/user/services/user.service';

@Component({ standalone: true, template: '' })
class DummyRouteComponent {}

describe('Topbar', () => {
  let component: Topbar;
  let fixture: ComponentFixture<Topbar>;
  let router: Router;
  let currentUserSignal: WritableSignal<IUserResponse | null>;

  const mockUser: IUserResponse = {
    id: '10',
    name: 'João Mendes',
    email: 'joao@ufop.edu.br',
    role: 'Administrador',
  };

  beforeEach(async () => {
    currentUserSignal = signal<IUserResponse | null>(mockUser);

    await TestBed.configureTestingModule({
      imports: [Topbar],
      providers: [
        provideZonelessChangeDetection(),
        provideAnimationsAsync('noop'),
        provideRouter([
          {
            path: 'campanhas',
            data: { breadcrumb: 'Campanhas' },
            component: DummyRouteComponent,
            children: [
              {
                path: 'nova',
                data: { breadcrumb: 'Nova Campanha' },
                component: DummyRouteComponent,
              },
            ],
          },
          { path: 'sem-breadcrumb', component: DummyRouteComponent },
          { path: 'perfil', component: DummyRouteComponent },
          { path: 'login', component: DummyRouteComponent },
        ]),
        { provide: UserService, useValue: { currentUser: currentUserSignal } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Topbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_name_override');
  });

  it('should create and render breadcrumb and user-menu with current user', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('breadcrumb')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('lumen-user-menu')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.user-name').textContent.trim()).toBe('João Mendes');
  });

  it('should expose userMenuConfig with Meu Perfil and Sair actions', () => {
    const items = component.userMenuConfig();
    expect(items.length).toBe(2);
    expect(items[0].label).toBe('Meu Perfil');
    expect(items[1].label).toBe('Sair');

    const navigateSpy = spyOn(router, 'navigate');
    items[0].command?.({});
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/perfil']);

    const logoutSpy = spyOn(component, 'logout');
    items[1].command?.({});
    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });

  it('should clear auth storage, reset currentUser to null, and navigate to /login on logout', () => {
    localStorage.setItem('auth_token', 'fake-jwt');
    localStorage.setItem('auth_name_override', 'Nome Customizado');
    const navigateSpy = spyOn(router, 'navigate');

    component.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_name_override')).toBeNull();
    expect(currentUserSignal()).toBeNull();
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/login']);
  });

  it('should build nested breadcrumbs on NavigationEnd', async () => {
    await router.navigateByUrl('/campanhas/nova');
    fixture.detectChanges();

    expect(component.breadcrumbs()).toEqual([
      { label: 'Campanhas', url: '/campanhas' },
      { label: 'Nova Campanha', url: '/campanhas/nova' },
    ]);

    const breadcrumbLinks = fixture.nativeElement.querySelectorAll('.breadcrumb__link');
    const currentBreadcrumb = fixture.nativeElement.querySelector('.breadcrumb__current');
    expect(breadcrumbLinks.length).toBe(1);
    expect(breadcrumbLinks[0].textContent.trim()).toBe('Campanhas');
    expect(currentBreadcrumb.textContent.trim()).toBe('Nova Campanha');
  });

  it('should produce empty breadcrumbs when route has no breadcrumb data', async () => {
    await router.navigateByUrl('/sem-breadcrumb');
    fixture.detectChanges();

    expect(component.breadcrumbs()).toEqual([]);
  });

  it('should initialize breadcrumbs on ngOnInit timeout', async () => {
    await router.navigateByUrl('/campanhas');
    const freshFixture = TestBed.createComponent(Topbar);
    freshFixture.detectChanges();

    await new Promise((resolve) => setTimeout(resolve, 20));
    freshFixture.detectChanges();

    expect(freshFixture.componentInstance.breadcrumbs()).toEqual([
      { label: 'Campanhas', url: '/campanhas' },
    ]);
  });
});
