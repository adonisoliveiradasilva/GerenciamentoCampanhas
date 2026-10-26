import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectMini } from './select-mini';

describe('SelectMini', () => {
  let component: SelectMini;
  let fixture: ComponentFixture<SelectMini>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMini]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectMini);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
