import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTime } from './date-time';

describe('DateTime', () => {
  let component: DateTime;
  let fixture: ComponentFixture<DateTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateTime]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateTime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
