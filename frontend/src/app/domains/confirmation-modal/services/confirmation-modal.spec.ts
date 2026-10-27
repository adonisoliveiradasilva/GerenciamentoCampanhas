import { TestBed } from '@angular/core/testing';

import { ConfirmationModal } from './confirmation-modal';

describe('ConfirmationModal', () => {
  let service: ConfirmationModal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmationModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
