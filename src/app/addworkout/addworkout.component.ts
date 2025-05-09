import {
  Component,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  Output,
} from '@angular/core';
import { DataService } from '../data.service';
import { Data } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { eSet, Exercise, MuscleGroup } from '../../data types/data-types';
import { DatePipe as dPipe } from '@angular/common';
import { AuthService } from '../auth.service';
import { parseActionCodeURL } from 'firebase/auth';

@Component({
  selector: 'app-addworkout',
  imports: [FormsModule, dPipe],
  templateUrl: './addworkout.component.html',
  styleUrl: './addworkout.component.css',
})
export class AddworkoutComponent implements OnInit {
  dataService: DataService = inject(DataService);
  authService: AuthService = inject(AuthService);
  exercises!: Exercise[];
  addingExercise: boolean = false;
  entryError: boolean = false;
  errorMsg: string = '';

  selectedExercise?: Exercise;
  exerciseName: string = '';
  exerciseMGroup: MuscleGroup = 0;
  exerciseDes: string = '';

  numberOfSets: number = 1;
  setArray: number[] = [];
  sets: eSet[] = [];
  totalVolume: number = 0;

  @Input({ required: true }) selectedDate!: Date;
  @Output() close = new EventEmitter<boolean>();

  selectExercisePlaceHolder: Exercise = {
    id: '',
    name: 'Select an Exercise',
    muscleGroup: 0,
    description: 'na',
  };

  ngOnInit(): void {
    this.dataService.getAllExercises().subscribe((e) => (this.exercises = e));
    this.setNumOfSets('1');
    this.selectedExercise = this.selectExercisePlaceHolder;
  }

  closeMenu(): void {
    this.close.emit(false);
  }

  setNumOfSets(str: string): void {
    const num = parseInt(str);
    if (Number.isNaN(num)) {
      console.error('Input is not a number: ' + str);
      return;
    }

    this.sets = Array.from({ length: num }).map(() => ({
      dataId: '',
      weight: 0,
      numOfReps: 0,
    }));
  }

  getMuscleGroups(): [string, number][] {
    const values: [string, number][] = [];
    Object.entries(MuscleGroup).map((obj) => {
      const number = parseInt(obj[0]);
      if (Number.isNaN(number) && obj[0].toLowerCase() != 'unknown') {
        values.push([obj[0], obj[1].valueOf() as number]);
      }
    });

    return values;
  }

  toggleAddExercise(): void {
    this.addingExercise = !this.addingExercise;
    if (this.addingExercise) {
      this.selectedExercise = this.selectExercisePlaceHolder;
    }
  }

  addWorkout() {
    const userId = this.authService.getUserId();

    if (this.validateInput() && this.selectedExercise) {
      this.dataService.addWorkout(
        this.selectedExercise,
        this.sets,
        userId,
        this.selectedDate
      );
      this.closeMenu();
    }
  }

  addExercise(): boolean {
    const name = this.exerciseName.trim();
    const description = this.exerciseDes.trim();
    const mGroup = parseInt(MuscleGroup[this.exerciseMGroup]);

    console.log(mGroup);

    if (name.trim() == '' || description.trim() == '') {
      this.entryError = true;
      this.errorMsg = 'Added exercise needs to have name and description';
      return false;
    }

    if (
      mGroup == null ||
      mGroup == undefined ||
      mGroup == 0 ||
      Number.isNaN(mGroup)
    ) {
      this.entryError = true;
      this.errorMsg = 'Added exercise needs to have muscle group';
      return false;
    }

    this.selectedExercise = {
      id: '',
      name: name,
      muscleGroup: mGroup,
      description: description,
    };
    return true;
  }

  validateInput(): boolean {
    if (this.addingExercise) {
      if (!this.addExercise()) {
        return false;
      }
    }

    console.log('Exercise: ' + JSON.stringify(this.selectedExercise));

    // Check sets
    if (this.sets) {
      for (const set of this.sets) {
        console.log(JSON.stringify(set));

        if (set.weight == 0 || set.numOfReps == 0) {
          this.entryError = true;
          this.errorMsg = 'Sets weight and or reps cannont 0.';
          return false;
        }

        if (
          !this.isValidNumber(set.weight) ||
          !this.isValidNumber(set.numOfReps)
        ) {
          this.entryError = true;
          this.errorMsg = 'Sets need to be a number';
          return false;
        }
      }
    } else {
      this.entryError = true;
      this.errorMsg = 'Sets are not defined.';
      return false;
    }

    if (
      !this.selectedExercise ||
      this.selectedExercise === this.selectExercisePlaceHolder
    ) {
      this.entryError = true;
      this.errorMsg = 'Exercise is not selected.';
      return false;
    }

    this.entryError = false;
    return true;
  }

  isValidNumber(input: any): boolean {
    const n = parseInt(input);
    return !Number.isNaN(n);
  }
}
