import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VolumeMuscleGroupComponent } from '../volume-muscle-group/volume-muscle-group.component';
import { VolumeExerciseComponent } from "../volume-exercise/volume-exercise.component";

@Component({
  selector: 'app-interval-stats-page',
  imports: [VolumeMuscleGroupComponent, FormsModule, VolumeExerciseComponent],
  templateUrl: './interval-stats-page.component.html',
  styleUrl: './interval-stats-page.component.css'
})
export class IntervalStatsPageComponent {
  startDate: Date = new Date();
  endDate: Date = new Date();
  showStats: boolean = false;

  onSubmit(form: any): void {
    this.showStats = false;

    const today = new Date();

    // Convert string inputs to Date objects
    const parsedStartDate = new Date(form.value.startDate);
    const parsedEndDate = new Date(form.value.endDate);

    // Validate the date objects
    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      alert('Please enter valid dates.');
      return;
    }

    // Ensure the end date is today or earlier
    if (parsedEndDate > today) {
      alert('End date must be today or earlier.');
      return;
    }

    this.startDate = parsedStartDate;
    this.endDate = parsedEndDate;
    this.showStats = true;
  }
}
