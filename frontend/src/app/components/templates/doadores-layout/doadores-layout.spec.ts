import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoadoresLayout } from './doadores-layout';

describe('DoadoresLayout', () => {
  let component: DoadoresLayout;
  let fixture: ComponentFixture<DoadoresLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoadoresLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoadoresLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
