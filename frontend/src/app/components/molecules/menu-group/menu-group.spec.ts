import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MenuGroup } from './menu-group';
import { MenuItem } from '../../atoms/menu-item/menu-item';
import { IMenuNode } from '../../../domains/menu/models/menu.model';

describe('MenuGroup', () => {
  let component: MenuGroup;
  let fixture: ComponentFixture<MenuGroup>;

  const mockGroup: IMenuNode = {
    label: 'Administração',
    icon: 'fa-solid fa-layer-group',
    children: [
      { label: 'Visão Geral', route: '/dashboard', icon: 'fa-solid fa-chart-pie' },
      { label: 'Campanhas', route: '/campanhas', icon: 'fa-solid fa-bullhorn' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuGroup],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuGroup);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('groupData', mockGroup);
    fixture.detectChanges();
  });

  it('should create and render group label', () => {
    expect(component).toBeTruthy();

    const labelSpan: HTMLElement = fixture.nativeElement.querySelector('.menu-group-content > span');
    expect(labelSpan.textContent?.trim()).toBe('Administração');
    expect(labelSpan.classList.contains('is-collapsed')).toBeFalse();
  });

  it('should render one lumen-menu-item for each child node', () => {
    const menuItems = fixture.debugElement.queryAll(By.directive(MenuItem));
    expect(menuItems.length).toBe(2);
    expect(menuItems[0].componentInstance.itemData()).toEqual(mockGroup.children![0]);
    expect(menuItems[1].componentInstance.itemData()).toEqual(mockGroup.children![1]);
  });

  it('should apply is-collapsed class and propagate isCollapsed to child menu items', () => {
    fixture.componentRef.setInput('isCollapsed', true);
    fixture.detectChanges();

    const labelSpan: HTMLElement = fixture.nativeElement.querySelector('.menu-group-content > span');
    const menuItems = fixture.debugElement.queryAll(By.directive(MenuItem));

    expect(labelSpan.classList.contains('is-collapsed')).toBeTrue();
    menuItems.forEach((item) => {
      expect(item.componentInstance.isCollapsed()).toBeTrue();
    });
  });

  it('should handle null isCollapsed as not collapsed', () => {
    fixture.componentRef.setInput('isCollapsed', null);
    fixture.detectChanges();

    const labelSpan: HTMLElement = fixture.nativeElement.querySelector('.menu-group-content > span');
    expect(labelSpan.classList.contains('is-collapsed')).toBeFalse();
  });

  it('should handle group without children', () => {
    fixture.componentRef.setInput('groupData', {
      label: 'Vazio',
      icon: 'fa-solid fa-folder',
    });
    fixture.detectChanges();

    const labelSpan: HTMLElement = fixture.nativeElement.querySelector('.menu-group-content > span');
    const menuItems = fixture.debugElement.queryAll(By.directive(MenuItem));

    expect(labelSpan.textContent?.trim()).toBe('Vazio');
    expect(menuItems.length).toBe(0);
  });
});
