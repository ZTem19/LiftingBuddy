import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeMuscleGroupComponent } from './volume-muscle-group.component';

describe('VolumeMuscleGroupComponent', () => {
  let component: VolumeMuscleGroupComponent;
  let fixture: ComponentFixture<VolumeMuscleGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolumeMuscleGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolumeMuscleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
