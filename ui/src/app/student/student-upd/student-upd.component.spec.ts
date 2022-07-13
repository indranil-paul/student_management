import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentUpdComponent } from './student-upd.component';

describe('StudentUpdComponent', () => {
  let component: StudentUpdComponent;
  let fixture: ComponentFixture<StudentUpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentUpdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentUpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
