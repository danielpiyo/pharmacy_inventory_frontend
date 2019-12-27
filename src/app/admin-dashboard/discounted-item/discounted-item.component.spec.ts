import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountedItemComponent } from './discounted-item.component';

describe('DiscountedItemComponent', () => {
  let component: DiscountedItemComponent;
  let fixture: ComponentFixture<DiscountedItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountedItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
