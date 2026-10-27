import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItensLayout } from './itens-layout';

describe('ItensLayout', () => {
  let component: ItensLayout;
  let fixture: ComponentFixture<ItensLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItensLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItensLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
