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

  volumeExerciseMap: Map<string, { exercise: Exercise, volume: number }>= new Map();
  isLoaded: boolean = true;
  
  constructor(private intervalService: IntervalServiceService) {}

  ngOnChanges(): void 
  {
    this.loadData();
  }

  async loadData()
  {
    this.isLoaded = false;
    this.volumeExerciseMap = await this.intervalService.GetVolumeExercise(this.startDate, this.endDate);
    this.isLoaded = true;
  }
}
