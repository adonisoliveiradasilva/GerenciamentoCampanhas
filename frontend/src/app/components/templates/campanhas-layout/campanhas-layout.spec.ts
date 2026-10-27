import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampanhasLayout } from './campanhas-layout';

describe('CampanhasLayout', () => {
  let component: CampanhasLayout;
  let fixture: ComponentFixture<CampanhasLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampanhasLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampanhasLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
