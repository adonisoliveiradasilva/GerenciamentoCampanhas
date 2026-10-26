import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackState } from './empty-state';

describe('FeedbackState', () => {
  let component: FeedbackState;
  let fixture: ComponentFixture<FeedbackState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
