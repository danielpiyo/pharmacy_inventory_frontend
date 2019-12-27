import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutDiscountedItemComponent } from './checkout-discounted-item.component';

describe('CheckoutDiscountedItemComponent', () => {
  let component: CheckoutDiscountedItemComponent;
  let fixture: ComponentFixture<CheckoutDiscountedItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutDiscountedItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutDiscountedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
