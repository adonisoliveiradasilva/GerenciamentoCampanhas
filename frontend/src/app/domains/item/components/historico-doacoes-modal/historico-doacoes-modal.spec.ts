import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoDoacoesModal } from './historico-doacoes-modal';

describe('HistoricoDoacoesModal', () => {
  let component: HistoricoDoacoesModal;
  let fixture: ComponentFixture<HistoricoDoacoesModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoDoacoesModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoDoacoesModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
