import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Doadores } from './doadores';

describe('Doadores', () => {
  let component: Doadores;
  let fixture: ComponentFixture<Doadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Doadores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Doadores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
