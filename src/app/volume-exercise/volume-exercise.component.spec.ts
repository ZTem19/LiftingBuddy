import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeExerciseComponent } from './volume-exercise.component';

describe('VolumeExerciseComponent', () => {
  let component: VolumeExerciseComponent;
  let fixture: ComponentFixture<VolumeExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolumeExerciseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolumeExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
