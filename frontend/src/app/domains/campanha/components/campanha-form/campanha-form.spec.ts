import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampanhaForm } from './campanha-form';

describe('CampanhaForm', () => {
  let component: CampanhaForm;
  let fixture: ComponentFixture<CampanhaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampanhaForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampanhaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
