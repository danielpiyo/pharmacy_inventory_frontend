import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIncomesComponent } from './admin-incomes.component';

describe('AdminIncomesComponent', () => {
  let component: AdminIncomesComponent;
  let fixture: ComponentFixture<AdminIncomesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminIncomesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminIncomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
