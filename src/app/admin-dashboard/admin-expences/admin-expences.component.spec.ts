import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExpencesComponent } from './admin-expences.component';

describe('AdminExpencesComponent', () => {
  let component: AdminExpencesComponent;
  let fixture: ComponentFixture<AdminExpencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminExpencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminExpencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
