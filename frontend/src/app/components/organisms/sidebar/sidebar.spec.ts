import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal, WritableSignal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Sidebar } from './sidebar';
import { SidebarService } from '../../../domains/sidebar/sidebar-service/sidebar-service';
import { IUserResponse, UserService } from '../../../domains/user/services/user.service';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let collapsedSubject: BehaviorSubject<boolean>;
  let sidebarServiceMock: { isCollapsed$: BehaviorSubject<boolean>; toggle: jasmine.Spy };
  let currentUserSignal: WritableSignal<IUserResponse | null>;

  beforeEach(async () => {
    collapsedSubject = new BehaviorSubject<boolean>(false);
    sidebarServiceMock = {
      isCollapsed$: collapsedSubject,
      toggle: jasmine.createSpy('toggle').and.callFake(() => {
        collapsedSubject.next(!collapsedSubject.value);
      }),
    };
    currentUserSignal = signal<IUserResponse | null>({
      id: '1',
      name: 'Operador Teste',
      email: 'operador@ufop.edu.br',
      role: 'Operador',
    });

    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: SidebarService, useValue: sidebarServiceMock },
        { provide: UserService, useValue: { currentUser: currentUserSignal } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create with initial expanded state and pt-BR locale', () => {
    expect(component).toBeTruthy();
    expect(component.isCollapsed()).toBeFalse();
    expect(component.mappedLocale()).toBe('pt-BR');
    expect(fixture.nativeElement.querySelector('lumen-logo')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('lumen-date-time')).toBeTruthy();
  });

  it('should render only Administração menu group for non-admin users', () => {
    const menuGroups = fixture.nativeElement.querySelectorAll('lumen-menu-group');
    expect(component.authorizedMenu().length).toBe(1);
    expect(component.authorizedMenu()[0].label).toBe('Administração');
    expect(menuGroups.length).toBe(1);
  });

  it('should include Configurações menu group when user role is Administrador', () => {
    currentUserSignal.set({
      id: '2',
      name: 'Admin Teste',
      email: 'admin@ufop.edu.br',
      role: 'Administrador',
    });
    fixture.detectChanges();

    const menuGroups = fixture.nativeElement.querySelectorAll('lumen-menu-group');
    expect(component.authorizedMenu().length).toBe(2);
    expect(component.authorizedMenu()[1].label).toBe('Configurações');
    expect(menuGroups.length).toBe(2);
  });

  it('should handle null currentUser without error', () => {
    currentUserSignal.set(null);
    fixture.detectChanges();

    expect(component.authorizedMenu().length).toBe(1);
  });

  it('should toggle sidebar state, update collapsed class, switch icon, and hide date-time when collapsed', () => {
    const contentEl: HTMLElement = fixture.nativeElement.querySelector('.sidebar-content');
    const toggleBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.logo-button-wrapper lumen-button button');

    expect(contentEl.classList.contains('collapsed')).toBeFalse();
    expect(toggleBtn.querySelector('i')?.className).toContain('fa-angles-left');
    expect(fixture.nativeElement.querySelector('lumen-date-time')).toBeTruthy();

    toggleBtn.click();
    fixture.detectChanges();

    expect(sidebarServiceMock.toggle).toHaveBeenCalledTimes(1);
    expect(component.isCollapsed()).toBeTrue();
    expect(contentEl.classList.contains('collapsed')).toBeTrue();
    expect(toggleBtn.querySelector('i')?.className).toContain('fa-angles-right');
    expect(fixture.nativeElement.querySelector('lumen-date-time')).toBeNull();
  });

  it('should enable animationsReady and with-transition class after ngAfterViewInit delay', async () => {
    expect(component.animationsReady()).toBeFalse();

    await new Promise((resolve) => setTimeout(resolve, 75));
    fixture.detectChanges();

    const contentEl: HTMLElement = fixture.nativeElement.querySelector('.sidebar-content');
    expect(component.animationsReady()).toBeTrue();
    expect(contentEl.classList.contains('with-transition')).toBeTrue();
  });
});
