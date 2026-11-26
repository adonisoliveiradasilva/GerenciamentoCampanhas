import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { IMenuNode } from '../../../domains/menu/models/menu.model';
import { MenuItem } from './menu-item';

@Component({ standalone: true, template: '' })
class DummyRouteComponent {}

describe('MenuItem', () => {
  let fixture: ComponentFixture<MenuItem>;
  let component: MenuItem;
  let router: Router;

  const mockNode: IMenuNode = {
    label: 'Dashboard',
    icon: 'fa-chart-line',
    route: '/dashboard',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItem],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'dashboard', component: DummyRouteComponent },
          { path: 'campaigns', component: DummyRouteComponent },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(MenuItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('itemData', mockNode);
    fixture.detectChanges();
  });

  it('should create and render icon and label when expanded', () => {
    expect(component).toBeTruthy();
    expect(component.itemData()).toEqual(mockNode);
    expect(component.isCollapsed()).toBeFalse();

    const el = fixture.nativeElement as HTMLElement;
    const container = el.querySelector('.menu-item-content');
    const iconEl = el.querySelector('i');
    const labelEl = el.querySelector('span');

    expect(container?.classList.contains('menu-item-collapsed')).toBeFalse();
    expect(iconEl?.classList.contains('fas')).toBeTrue();
    expect(iconEl?.classList.contains('fa-chart-line')).toBeTrue();
    expect(labelEl?.textContent?.trim()).toBe('Dashboard');
  });

  it('should hide label and apply collapsed class when isCollapsed is true', () => {
    fixture.componentRef.setInput('isCollapsed', true);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.menu-item-content')?.classList.contains('menu-item-collapsed')).toBeTrue();
    expect(el.querySelector('span')).toBeNull();
    expect(el.querySelector('i')?.classList.contains('fa-chart-line')).toBeTrue();
  });

  it('should render label when isCollapsed is null', () => {
    fixture.componentRef.setInput('isCollapsed', null);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.menu-item-content')?.classList.contains('menu-item-collapsed')).toBeFalse();
    expect(el.querySelector('span')?.textContent?.trim()).toBe('Dashboard');
  });

  it('should apply active route class when current route matches itemData.route', async () => {
    await router.navigateByUrl('/dashboard');
    fixture.detectChanges();

    const container = (fixture.nativeElement as HTMLElement).querySelector('.menu-item-content');
    expect(container?.classList.contains('menu-item-content-active-route')).toBeTrue();

    await router.navigateByUrl('/campaigns');
    fixture.detectChanges();
    expect(container?.classList.contains('menu-item-content-active-route')).toBeFalse();
  });
});
