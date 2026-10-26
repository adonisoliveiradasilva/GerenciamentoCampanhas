import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastWrapper } from './toast-wrapper';

describe('ToastWrapper', () => {
  let component: ToastWrapper;
  let fixture: ComponentFixture<ToastWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
