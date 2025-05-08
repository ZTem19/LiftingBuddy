import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IntervalProgressTableComponent } from '../interval-progress-table/interval-progress-table.component';
import { addDays } from '../../utils/utils';
import { User } from '../../data types/data-types';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../auth.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interval-progress',
  imports: [FormsModule, IntervalProgressTableComponent],
  templateUrl: './interval-progress.component.html',
  styleUrl: './interval-progress.component.css'
})
export class IntervalProgressComponent {
  
  showProgress: boolean = false;
  startDate: Date = new Date();
  numberOfIntervals: number = 0;
  numberOfDays: number = 0;

  private userSubscription?: Subscription;
  user?: User | null = null;
  usinglbs: boolean = true; 
  private auth = inject(Auth);
  private authService = inject(AuthService);
  private router = inject(Router)

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
    const today = new Date();

    // Convert string date input to a date object
    const parsedStartDate = new Date(form.value.startDate);
    
    // set num of days and intervals from form values
    const parsedNumOfDays = form.value.numberDays;
    const parsedNumOfIntervals = form.value.numberIntervals;

    console.log(parsedNumOfDays)

    // Validate the start date
    if (isNaN(parsedStartDate.getTime())) {
      alert('Please enter a valid date.');
      this.showProgress = false;
      return;
    }

    // calculate final day
    const finalDay: Date = addDays(parsedStartDate, (parsedNumOfDays * parsedNumOfIntervals) - 1)
    
    // Ensure the end date is today or earlier
    if (finalDay > today) {
      alert('The last day of the last interval must be today or earlier.');
      this.showProgress = false;
      return;
    }

    // Ensure num of days is >= 1
    if (parsedNumOfDays < 1)
    {
      alert("The number of days must be greater than or equal to 1.");
      this.showProgress = false;
      return;
    }

    // Ensure num of intervals is >= 2
    if (parsedNumOfIntervals < 2)
    {
      alert("The number of intervals must be greater than or equal to 2.");
      this.showProgress = false;
      return;
    }

    // set values from form values
    this.startDate = parsedStartDate;
    this.numberOfDays = parsedNumOfDays;
    this.numberOfIntervals = parsedNumOfIntervals;
    this.showProgress = true;
  }
}
