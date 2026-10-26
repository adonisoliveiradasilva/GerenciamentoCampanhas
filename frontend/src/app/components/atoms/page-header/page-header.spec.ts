import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeHeader } from './tree-header';

describe('TreeHeader', () => {
  let component: TreeHeader;
  let fixture: ComponentFixture<TreeHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
