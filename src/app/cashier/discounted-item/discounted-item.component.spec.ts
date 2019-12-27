import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountedItemComponentChashier } from './discounted-item.component';

describe('DiscountedItemComponentChashier', () => {
  let component: DiscountedItemComponentChashier;
  let fixture: ComponentFixture<DiscountedItemComponentChashier>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountedItemComponentChashier ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountedItemComponentChashier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
