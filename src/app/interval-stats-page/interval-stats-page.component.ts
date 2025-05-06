import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VolumeMuscleGroupComponent } from '../volume-muscle-group/volume-muscle-group.component';
import { VolumeExerciseComponent } from '../volume-exercise/volume-exercise.component';
import { PercentageMuscleGroupWorkedComponent } from '../percentage-muscle-group-worked/percentage-muscle-group-worked.component';
import { FetchService } from '../fetch.service';
import { DataService } from '../data.service';
import exerciseData from '../../exercises.json';

@Component({
  selector: 'app-interval-stats-page',
  imports: [
    VolumeMuscleGroupComponent,
    FormsModule,
    VolumeExerciseComponent,
    PercentageMuscleGroupWorkedComponent,
  ],
  templateUrl: './interval-stats-page.component.html',
  styleUrl: './interval-stats-page.component.css',
})
export class IntervalStatsPageComponent {
  startDate: Date = new Date();
  endDate: Date = new Date();
  showStats: boolean = false;

  constructor(
    private fetchService: FetchService,
    private dataService: DataService
  ) {}

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

    if (parsedStartDate >= parsedEndDate) {
      alert('The end date must be later than the start date.');
      return;
    }

    this.startDate = parsedStartDate;
    this.endDate = parsedEndDate;
    this.showStats = true;
  }

  async addExercise() {
    // this.fetchService.getSetsForUserOnDay("3k7dINFrSssLj0qq8TqF", new Date(2025, 2, 2)).subscribe(
    //   (exerciseSets) => {
    //     console.log(exerciseSets); // Print the exercise sets array
    //     // You can also iterate through the array if needed:
    //     exerciseSets.forEach(set => {
    //       console.log(set); // Print each individual set
    //     });
    //   },
    //   (error) => {
    //     console.error("Error fetching exercise sets:", error);
    //   },
    //   () => {
    //     console.log("Observable completed."); // Optional: Handle completion
    //   }
    // );
    console.log('about to print data');
    let dataToPrint = await this.dataService.getExerciseSetsForDay(
      '3k7dINFrSssLj0qq8TqF',
      new Date(2, 2, 2025)
    );
    console.log(dataToPrint);
  }
}
