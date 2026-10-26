import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenModal } from './fullscreen-modal';

describe('FullscreenModal', () => {
  let component: FullscreenModal;
  let fixture: ComponentFixture<FullscreenModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullscreenModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullscreenModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
