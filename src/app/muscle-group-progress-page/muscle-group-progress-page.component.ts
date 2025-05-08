import { CommonModule } from '@angular/common';
import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { DataService } from '../data.service';
import { MuscleGroup, ExerciseSet, User } from '../../data types/data-types';
import { WeightUnitPipe } from '../weight-unit.pipe';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const MuscleGroupLabels: { [key: number]: string } = {
  [MuscleGroup.Unknown]: 'Unknown',
  [MuscleGroup.Chest]: 'Chest',
  [MuscleGroup.Back]: 'Back',
  [MuscleGroup.Biceps]: 'Biceps',
  [MuscleGroup.Triceps]: 'Triceps',
  [MuscleGroup.GlutesQuads]: 'Glutes & Quads',
  [MuscleGroup.HamstringsCalves]: 'Hamstrings & Calves',
};

@Component({
  selector: 'app-muscle-group-progress-page',
  standalone: true,
  imports: [CommonModule, WeightUnitPipe, FormsModule],
  templateUrl: './muscle-group-progress-page.component.html',
  styleUrls: ['./muscle-group-progress-page.component.css'],
})
export class MuscleGroupProgressPageComponent implements OnInit, AfterViewInit {
  @ViewChild('myChartCanvas') myChartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  muscleGroups: { value: number; label: string }[] = [];
  workoutData = new Map<string, ExerciseSet[]>();
  usePounds: boolean = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user: User | null = this.authService.getUserSync?.() ?? null;
    if (user?.units === 'lbs') {
      this.usePounds = true;
    }
  }

  ngAfterViewInit(): void {
    const ctx = this.myChartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Muscle Group Progress',
            data: [],
            borderColor: 'blue',
            fill: false,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Muscle Group Progress Over Time',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const unit =
                  (context.chart.options.scales?.['y'] as any)?.title?.text ||
                  '';
                return `${context.dataset.label}: ${context.raw} ${unit}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: `Total Volume (${this.usePounds ? 'lbs' : 'kg'})`,
            },
          },
        },
      },
    });
  }

  async retrieveStatistics(): Promise<void> {
    const startDateInput = (
      document.getElementById('start-date') as HTMLInputElement
    ).value;
    const endDateInput = (
      document.getElementById('end-date') as HTMLInputElement
    ).value;

    if (!startDateInput || !endDateInput) {
      alert('Please provide valid dates.');
      return;
    }

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);
    if (endDate < startDate) {
      alert('End date must be after start date.');
      return;
    }

    let d = new Date(startDate);
    while (d <= endDate) {
      await this.dataService.getExerciseSetsForDay(new Date(d));
      d.setDate(d.getDate() + 1);
    }

    this.workoutData = await this.dataService.getDataInDateRange(
      startDate,
      endDate
    );

    const muscleGroupSet = new Set<number>();
    const day = new Date(startDate);
    while (day <= endDate) {
      const dateStr = day.toISOString().split('T')[0];
      const sets = this.workoutData.get(dateStr);

      if (sets) {
        sets.forEach((exerciseSet) => {
          if (exerciseSet?.exercise?.muscleGroup != null) {
            muscleGroupSet.add(exerciseSet.exercise.muscleGroup);
          }
        });
      }

      day.setDate(day.getDate() + 1);
    }

    this.muscleGroups = Array.from(muscleGroupSet).map((group) => ({
      value: group,
      label: MuscleGroupLabels[group] ?? 'Unknown',
    }));
  }

  onMuscleGroupChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (target && target.value) {
      this.plotMuscleGroupProgress(target.value);
    }
  }

  plotMuscleGroupProgress(muscleGroupId: string): void {
    const selectedGroup = parseInt(muscleGroupId, 10);
    const labels: string[] = [];
    const data: number[] = [];

    const startDateInput = (
      document.getElementById('start-date') as HTMLInputElement
    ).value;
    const endDateInput = (
      document.getElementById('end-date') as HTMLInputElement
    ).value;

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    const day = new Date(startDate);
    while (day <= endDate) {
      const dateStr = day.toISOString().split('T')[0];
      const sets = this.workoutData.get(dateStr) || [];

      const totalVolume = sets
        .filter((s) => s.exercise.muscleGroup === selectedGroup)
        .reduce((sum, set) => {
          const vol = set.totalVolume || 0;
          return sum + (this.usePounds ? Math.round(vol / 0.453592) : vol);
        }, 0);

      labels.push(dateStr);
      data.push(totalVolume);

      day.setDate(day.getDate() + 1);
    }

    const yScale = this.chart.options.scales?.['y'];
    if (
      yScale &&
      typeof yScale === 'object' &&
      'title' in yScale &&
      yScale.title &&
      typeof yScale.title === 'object'
    ) {
      yScale.title.text = `Total Volume (${this.usePounds ? 'lbs' : 'kg'})`;
    }

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].label = `${MuscleGroupLabels[selectedGroup]} Progress`;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }
}
