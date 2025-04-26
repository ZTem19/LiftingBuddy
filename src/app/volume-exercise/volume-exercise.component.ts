import { Component, Input } from '@angular/core';
import { IntervalServiceService } from '../interval-service.service';
import { Exercise, MuscleGroup } from '../../data types/data-types';

@Component({
  selector: 'app-volume-exercise',
  imports: [],
  templateUrl: './volume-exercise.component.html',
  styleUrl: './volume-exercise.component.css'
})
export class VolumeExerciseComponent {
  @Input() startDate!: Date;
  @Input() endDate!: Date;

  volumeExerciseMap: Map<Exercise, number> = new Map();
  
  constructor(private intervalService: IntervalServiceService) {}

  ngOnChanges(): void 
  {
    this.volumeExerciseMap = this.intervalService.GetVolumeExercise(this.startDate, this.endDate);
  }
}
