import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageMuscleGroupWorkedComponent } from './percentage-muscle-group-worked.component';

describe('PercentageMuscleGroupWorkedComponent', () => {
  let component: PercentageMuscleGroupWorkedComponent;
  let fixture: ComponentFixture<PercentageMuscleGroupWorkedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PercentageMuscleGroupWorkedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PercentageMuscleGroupWorkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
