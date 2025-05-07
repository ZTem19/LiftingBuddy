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
import { eSet, Exercise } from '../../data types/data-types';
import { DatePipe as dPipe } from '@angular/common';

@Component({
  selector: 'app-addworkout',
  imports: [FormsModule, dPipe],
  templateUrl: './addworkout.component.html',
  styleUrl: './addworkout.component.css',
})
export class AddworkoutComponent implements OnInit {
  dataService: DataService = inject(DataService);
  exercises!: Exercise[];
  addingExercise: boolean = false;

  selectedExercise?: Exercise;
  sets?: eSet[];
  totalVolume: number = 0;

  @Input({ required: true }) selectedDate!: Date;
  @Output() close = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.dataService.getAllExercises().subscribe((e) => (this.exercises = e));
  }

  closeMenu() {
    this.close.emit(false);
  }

  addWorkout() {}

  addExercise() {}
}
