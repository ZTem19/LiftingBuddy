import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseProgressPageComponent } from './exercise-progress-page.component';

describe('ExerciseProgressPageComponent', () => {
  let component: ExerciseProgressPageComponent;
  let fixture: ComponentFixture<ExerciseProgressPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseProgressPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseProgressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
