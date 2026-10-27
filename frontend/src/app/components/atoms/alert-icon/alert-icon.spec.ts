import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertIcon } from './alert-icon';

describe('AlertIcon', () => {
  let component: AlertIcon;
  let fixture: ComponentFixture<AlertIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
