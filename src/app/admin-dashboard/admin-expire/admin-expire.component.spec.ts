import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExpireComponent } from './admin-expire.component';

describe('AdminExpireComponent', () => {
  let component: AdminExpireComponent;
  let fixture: ComponentFixture<AdminExpireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminExpireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminExpireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
