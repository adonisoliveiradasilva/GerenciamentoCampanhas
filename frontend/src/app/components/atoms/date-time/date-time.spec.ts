import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTime } from './date-time';

describe('DateTime', () => {
  let fixture: ComponentFixture<DateTime>;
  let component: DateTime;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateTime],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 4, 15, 14, 30, 0));

    fixture = TestBed.createComponent(DateTime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    jasmine.clock().uninstall();
  });

  it('should create and display formatted date and time for default pt-BR locale', () => {
    const fixedDate = new Date(2026, 4, 15, 14, 30, 0);
    const expectedTime = fixedDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const expectedDate = fixedDate.toLocaleDateString('pt-BR');

    expect(component).toBeTruthy();
    expect(component.locale()).toBe('pt-BR');
    expect(component.currentTime()).toBe(expectedTime);
    expect(component.currentDate()).toBe(expectedDate);

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.time')?.textContent?.trim()).toBe(expectedTime);
    expect(el.querySelector('.date')?.textContent?.trim()).toBe(expectedDate);
  });

  it('should update formatted date and time when locale input changes', () => {
    const fixedDate = new Date(2026, 4, 15, 14, 30, 0);
    const expectedTime = fixedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const expectedDate = fixedDate.toLocaleDateString('en-US');

    fixture.componentRef.setInput('locale', 'en-US');
    fixture.detectChanges();

    expect(component.currentTime()).toBe(expectedTime);
    expect(component.currentDate()).toBe(expectedDate);

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.time')?.textContent?.trim()).toBe(expectedTime);
    expect(el.querySelector('.date')?.textContent?.trim()).toBe(expectedDate);
  });

  it('should update time periodically via interval', () => {
    jasmine.clock().tick(60_000);
    fixture.detectChanges();

    const updatedDate = new Date(2026, 4, 15, 14, 31, 0);
    const expectedTime = updatedDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    expect(component.currentTime()).toBe(expectedTime);
    expect((fixture.nativeElement as HTMLElement).querySelector('.time')?.textContent?.trim()).toBe(expectedTime);
  });

  it('should clear interval when destroyed', () => {
    const timeBeforeDestroy = component.currentTime();

    fixture.destroy();

    jasmine.clock().tick(120_000);
    expect(component.currentTime()).toBe(timeBeforeDestroy);
  });
});
