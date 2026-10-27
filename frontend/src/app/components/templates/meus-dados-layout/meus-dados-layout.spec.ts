import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeusDadosLayout } from './meus-dados-layout';

describe('MeusDadosLayout', () => {
  let component: MeusDadosLayout;
  let fixture: ComponentFixture<MeusDadosLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeusDadosLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeusDadosLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
