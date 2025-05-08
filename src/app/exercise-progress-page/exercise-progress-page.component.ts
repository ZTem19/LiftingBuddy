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
import { ExerciseSet, User } from '../../data types/data-types';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { FetchService } from '../fetch.service';

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

@Component({
  selector: 'app-exercise-progress-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exercise-progress-page.component.html',
  styleUrls: ['./exercise-progress-page.component.css'],
})
export class ExerciseProgressPageComponent implements OnInit, AfterViewInit {
  @ViewChild('exerciseChartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  usePounds: boolean = false;
  exercises: { id: string; name: string }[] = [];
  workoutData = new Map<string, ExerciseSet[]>();

  constructor(
    private fetchService: FetchService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user: User | null = this.authService.getUserSync();
    if (user?.units === 'lbs') {
      this.usePounds = true;
    }
  }

  ngAfterViewInit(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
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
            label: 'Avg Weight Progress',
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
            text: 'Exercise Progress Over Time',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const title =
                  (context.chart.options.scales?.['y'] as any)?.title?.text ||
                  '';
                const unit = title.match(/\((.*?)\)/)?.[1] || '';
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

  private getDateKey(date: Date): string {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // clear time

    // Generate YYYY-MM-DD in local time
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private convertVolume(volume: number): number {
    return this.usePounds ? Math.round(volume / 0.453592) : volume;
  }

  async retrieveExerciseStatistics(): Promise<void> {
    const startDateInput = (
      document.getElementById('exercise-start-date') as HTMLInputElement
    ).value;
    const endDateInput = (
      document.getElementById('exercise-end-date') as HTMLInputElement
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

    const user: User | null = this.authService.getUserSync();
    if (!user) {
      alert('User not authenticated.');
      return;
    }

    this.workoutData = await this.fetchService.getExerciseSetsInDateRange(
      user.id,
      startDate,
      endDate
    );

    const seen = new Map<string, string>();
    for (const sets of this.workoutData.values()) {
      for (const set of sets) {
        const ex = set.exercise;
        if (ex?.id && ex.name && !seen.has(ex.id)) {
          seen.set(ex.id, ex.name);
        }
      }
    }

    this.exercises = Array.from(seen.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }

  async onExerciseChange(event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    if (!select?.value) return;

    const selectedExerciseId = select.value;

    const startDateInput = (
      document.getElementById('exercise-start-date') as HTMLInputElement
    ).value;
    const endDateInput = (
      document.getElementById('exercise-end-date') as HTMLInputElement
    ).value;

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    const labels: string[] = [];
    const data: number[] = [];

    let current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const sets = this.workoutData.get(dateStr) || [];

      // Extract only matching sets for the selected exercise
      const matchingSets = sets.filter(
        (set) => set.exercise?.id === selectedExerciseId
      );

      let totalWeight = 0;
      let setCount = 0;

      for (const setGroup of matchingSets) {
        if (Array.isArray(setGroup.sets)) {
          for (const s of setGroup.sets) {
            totalWeight += s.weight || 0;
            setCount++;
          }
        }
      }

      const avgWeight =
        setCount > 0 ? this.convertVolume(totalWeight / setCount) : 0;

      labels.push(dateStr);
      data.push(avgWeight);

      current.setDate(current.getDate() + 1);
    }

    const selectedExerciseName =
      this.exercises.find((e) => e.id === selectedExerciseId)?.name ??
      'Exercise';

    const yAxis = this.chart.options.scales?.['y'] as any;
    if (yAxis && yAxis.title) {
      yAxis.title.text = `Average Weight per Set (${
        this.usePounds ? 'lbs' : 'kg'
      })`;
    }

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].label = `${selectedExerciseName} Avg Weight`;
    this.chart.data.datasets[0].data = data;
    this.chart.update('none');
  }
}
