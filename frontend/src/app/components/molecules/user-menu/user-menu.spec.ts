import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { By } from '@angular/platform-browser';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { UserMenu } from './user-menu';
import { IUserResponse } from '../../../domains/user/services/user.service';

describe('UserMenu', () => {
  let component: UserMenu;
  let fixture: ComponentFixture<UserMenu>;

  const mockUser: IUserResponse = {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@ufop.edu.br',
    role: 'Administrador',
  };

  const mockMenuItems: MenuItem[] = [
    { label: 'Meu Perfil', icon: 'fa-solid fa-user' },
    { label: 'Sair', icon: 'fa-solid fa-right-from-bracket' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenu],
      providers: [provideZonelessChangeDetection(), provideAnimationsAsync('noop')],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMenu);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', mockUser);
    fixture.componentRef.setInput('menuItems', mockMenuItems);
    fixture.detectChanges();
  });

  it('should create and render user name, role, and avatar initials', () => {
    expect(component).toBeTruthy();

    const userName = fixture.nativeElement.querySelector('.user-name');
    const userRole = fixture.nativeElement.querySelector('.user-role');
    const avatar = fixture.nativeElement.querySelector('lumen-avatar');

    expect(userName.textContent.trim()).toBe('Maria Silva');
    expect(userRole.textContent.trim()).toBe('Administrador');
    expect(avatar).toBeTruthy();
    expect(avatar.textContent.trim()).toBe('MS');
  });

  it('should not render user menu container when user is null', () => {
    fixture.componentRef.setInput('user', null);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.user-menu-container')).toBeNull();
  });

  it('should rotate chevron when isOpen signal changes', () => {
    const chevron: HTMLElement = fixture.nativeElement.querySelector('.chevron-circle');
    expect(component.isOpen()).toBeFalse();
    expect(chevron.classList.contains('rotated')).toBeFalse();

    component.isOpen.set(true);
    fixture.detectChanges();

    expect(chevron.classList.contains('rotated')).toBeTrue();
  });

  it('should call menu.toggle with event when toggleMenu is invoked', () => {
    const mockMenu = { toggle: jasmine.createSpy('toggle') } as unknown as Menu;
    const mockEvent = new MouseEvent('click');

    component.toggleMenu(mockEvent, mockMenu);

    expect(mockMenu.toggle).toHaveBeenCalledOnceWith(mockEvent);
  });

  it('should toggle PrimeNG menu when user-trigger is clicked and update isOpen on show/hide', () => {
    const menuDebugEl = fixture.debugElement.query(By.directive(Menu));
    const menuInstance: Menu = menuDebugEl.componentInstance;
    const toggleSpy = spyOn(menuInstance, 'toggle');

    const trigger: HTMLElement = fixture.nativeElement.querySelector('.user-trigger');
    trigger.click();

    expect(toggleSpy).toHaveBeenCalledTimes(1);

    menuInstance.onShow.emit({});
    fixture.detectChanges();
    expect(component.isOpen()).toBeTrue();
    expect(fixture.nativeElement.querySelector('.chevron-circle').classList.contains('rotated')).toBeTrue();

    menuInstance.onHide.emit({});
    fixture.detectChanges();
    expect(component.isOpen()).toBeFalse();
    expect(fixture.nativeElement.querySelector('.chevron-circle').classList.contains('rotated')).toBeFalse();
  });
});
