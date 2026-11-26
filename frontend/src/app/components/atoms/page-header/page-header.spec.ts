import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeader } from './page-header';

describe('PageHeader', () => {
  let fixture: ComponentFixture<PageHeader>;
  let component: PageHeader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeader],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with default empty label', () => {
    expect(component).toBeTruthy();
    expect(component.label()).toBe('');

    const heading = (fixture.nativeElement as HTMLElement).querySelector('h3');
    expect(heading).toBeTruthy();
    expect(heading?.textContent?.trim()).toBe('');
  });

  it('should render provided label inside h3', () => {
    fixture.componentRef.setInput('label', 'Campanhas');
    fixture.detectChanges();

    const heading = (fixture.nativeElement as HTMLElement).querySelector('h3');
    expect(heading?.textContent?.trim()).toBe('Campanhas');
  });

  it('should update h3 text when label input changes', () => {
    fixture.componentRef.setInput('label', 'Usuários');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('h3')?.textContent?.trim()).toBe('Usuários');
  });
});
