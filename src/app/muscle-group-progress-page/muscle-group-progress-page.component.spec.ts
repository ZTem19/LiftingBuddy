import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuscleGroupProgressPageComponent } from './muscle-group-progress-page.component';

describe('MuscleGroupProgressPageComponent', () => {
  let component: MuscleGroupProgressPageComponent;
  let fixture: ComponentFixture<MuscleGroupProgressPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuscleGroupProgressPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MuscleGroupProgressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
