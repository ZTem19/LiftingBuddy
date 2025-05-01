import { Component, Inject, Input } from '@angular/core';
import { DataService } from '../data.service';
import { IntervalServiceService } from '../interval-service.service';
import { OnInit, OnChanges } from '@angular/core';
import { MuscleGroup } from '../../data types/data-types';

@Component({
  selector: 'app-volume-muscle-group',
  imports: [],
  templateUrl: './volume-muscle-group.component.html',
  styleUrl: './volume-muscle-group.component.css'
})
export class VolumeMuscleGroupComponent implements OnChanges {
   @Input() startDate!: Date;
   @Input() endDate!: Date;
  
  volumeMuscleGroupMap: Map<MuscleGroup, number> = new Map();

  chestVolume: number = 0;
  backVolume: number = 0;
  bicepsVolume: number = 0;
  tricepsVolume: number = 0;
  glutesQuadsVolume: number = 0;
  hamstringsCalvesVolume: number = 0;

  isLoaded: boolean = true;

  constructor(private intervalService: IntervalServiceService) {}
  
  ngOnChanges(): void 
  {
    this.loadData();
  }

  async loadData()
  {
    this.isLoaded = false;
    
    // Get volumes for each muscle group to display based on start date and end date from parent
    this.volumeMuscleGroupMap = await this.intervalService.GetVolumeMuscleGroup(this.startDate, this.endDate);

    this.chestVolume = this.volumeMuscleGroupMap.get(1) ?? 0;
    this.backVolume = this.volumeMuscleGroupMap.get(2) ?? 0;
    this.bicepsVolume = this.volumeMuscleGroupMap.get(3) ?? 0;
    this.tricepsVolume = this.volumeMuscleGroupMap.get(4) ?? 0;
    this.glutesQuadsVolume = this.volumeMuscleGroupMap.get(5) ?? 0;
    this.hamstringsCalvesVolume = this.volumeMuscleGroupMap.get(6) ?? 0;

    this.isLoaded = true;
  }
}
