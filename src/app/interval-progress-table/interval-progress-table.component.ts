import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MuscleGroup, MuscleGroupProgress } from '../../data types/data-types';
import { IntervalServiceService } from '../interval-service.service';

@Component({
  selector: 'app-interval-progress-table',
  imports: [],
  templateUrl: './interval-progress-table.component.html',
  styleUrl: './interval-progress-table.component.css'
})
export class IntervalProgressTableComponent implements OnChanges {
  @Input() startDate: Date = new Date();
  @Input() numIntervals: number = 0;
  @Input() numDays: number = 0;

  intervalProgressMap: Map<MuscleGroup, MuscleGroupProgress> = new Map();
  constructor(private intervalService: IntervalServiceService) {}
  chestMax: number = 1;

  ngOnChanges(): void 
  {
    this.intervalProgressMap = this.intervalService.GetIntervalProgress(this.startDate, this.numDays, this.numIntervals);
  }

  // used to get names of muscle groups based on enum type
  getMuscleGroupName(muscleGroup: MuscleGroup): string {
    switch (muscleGroup) {
      case MuscleGroup.Chest:
        return 'Chest';
      case MuscleGroup.Back:
        return 'Back';
      case MuscleGroup.Biceps:
        return 'Biceps';
      case MuscleGroup.Triceps:
        return 'Triceps';
      case MuscleGroup.GlutesQuads:
        return 'Glutes/Quads';
      case MuscleGroup.HamstringsCalves:
        return 'Hamstrings/Calves';
      default:
        return 'Unknown';
    }
  }

}
