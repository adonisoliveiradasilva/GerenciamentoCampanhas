import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoacaoForm } from './doacao-form';

describe('DoacaoForm', () => {
  let component: DoacaoForm;
  let fixture: ComponentFixture<DoacaoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoacaoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoacaoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
