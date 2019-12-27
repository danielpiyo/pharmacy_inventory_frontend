import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemBalanceComponent } from './item-balance.component';

describe('ItemBalanceComponent', () => {
  let component: ItemBalanceComponent;
  let fixture: ComponentFixture<ItemBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
