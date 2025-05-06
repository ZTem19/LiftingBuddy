import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VolumeMuscleGroupComponent } from '../volume-muscle-group/volume-muscle-group.component';
import { VolumeExerciseComponent } from '../volume-exercise/volume-exercise.component';
import { PercentageMuscleGroupWorkedComponent } from '../percentage-muscle-group-worked/percentage-muscle-group-worked.component';
import { FetchService } from '../fetch.service';
import { DataService } from '../data.service';
import exerciseData from '../../exercises.json';
import { User } from '../../data types/data-types';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../auth.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { Router } from '@angular/router';

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

  private userSubscription?: Subscription;
  user?: User | null = null;
  usinglbs: boolean = true; 
  private auth = inject(Auth);
  private authService = inject(AuthService);

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  // Get user info especially for whether to use kg or pounds
  ngOnInit()
  {
    this.userSubscription = this.authService.user.subscribe(user => {
      if (user == null) {
        this.router.navigate(['login-page']);
      } else {
        this.user = user;
        if (user.units === 'kg') 
        {
          this.usinglbs = false;
        }
      }
    });
  }

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

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }
}
