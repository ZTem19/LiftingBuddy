import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
  imports: [CommonModule],
  templateUrl: './exercise-progress-page.component.html',
  styleUrl: './exercise-progress-page.component.css',
})
export class ExerciseProgressPageComponent implements AfterViewInit {
  @ViewChild('myChartCanvas') myChartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  // Sample exercises
  exercises: string[] = ['Push-ups', 'Running', 'Squats', 'Cycling', 'Plank'];

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
            label: 'Exercise Progress',
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
        },
      },
    });
  }

  retrieveStatistics(): void {
    const startDateInput = (
      document.getElementById('start-date') as HTMLInputElement
    ).value;
    const endDateInput = (
      document.getElementById('end-date') as HTMLInputElement
    ).value;
    const selectedExercise = (
      document.getElementById('exercise-select') as HTMLSelectElement
    ).value;

    if (!startDateInput || !endDateInput || !selectedExercise) {
      alert('Please provide valid inputs.');
      return;
    }

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);
    const labels: string[] = [];
    const data: number[] = [];

    const daysDiff =
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;

    if (daysDiff <= 0) {
      alert('End date must be after start date.');
      return;
    }

    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      labels.push(date.toISOString().split('T')[0]);

      // Random data generation logic (you can customize per exercise)
      let value = 0;
      switch (selectedExercise) {
        case 'Push-ups':
          value = Math.floor(Math.random() * 30) + 10;
          break;
        case 'Running':
          value = Math.floor(Math.random() * 5) + 1; // kilometers
          break;
        case 'Squats':
          value = Math.floor(Math.random() * 50) + 20;
          break;
        case 'Cycling':
          value = Math.floor(Math.random() * 15) + 5;
          break;
        case 'Plank':
          value = Math.floor(Math.random() * 120) + 30; // seconds
          break;
        default:
          value = Math.floor(Math.random() * 100);
      }

      data.push(value);
    }

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].label = `${selectedExercise} Progress`;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }
}