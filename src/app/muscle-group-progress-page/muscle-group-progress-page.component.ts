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
  selector: 'app-muscle-group-progress-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './muscle-group-progress-page.component.html',
  styleUrls: ['./muscle-group-progress-page.component.css'],
})
export class MuscleGroupProgressPageComponent implements AfterViewInit {
  @ViewChild('myChartCanvas') myChartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  // Sample muscle groups
  muscleGroups: string[] = [
    'Chest',
    'Back',
    'Legs',
    'Shoulders',
    'Arms',
    'Core',
  ];

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
    const selectedMuscle = (
      document.getElementById('muscle-select') as HTMLSelectElement
    ).value;

    if (!startDateInput || !endDateInput || !selectedMuscle) {
      alert('Please provide valid inputs.');
      return;
    }

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);
    const daysDiff =
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;

    if (daysDiff <= 0) {
      alert('End date must be after start date.');
      return;
    }

    const labels: string[] = [];
    const data: number[] = [];

    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      labels.push(date.toISOString().split('T')[0]);

      // Generate random data based on muscle group
      let value = 0;
      switch (selectedMuscle) {
        case 'Chest':
          value = Math.floor(Math.random() * 50) + 20;
          break;
        case 'Back':
          value = Math.floor(Math.random() * 60) + 15;
          break;
        case 'Legs':
          value = Math.floor(Math.random() * 70) + 25;
          break;
        case 'Shoulders':
          value = Math.floor(Math.random() * 40) + 10;
          break;
        case 'Arms':
          value = Math.floor(Math.random() * 45) + 15;
          break;
        case 'Core':
          value = Math.floor(Math.random() * 60) + 10;
          break;
        default:
          value = Math.floor(Math.random() * 100);
      }

      data.push(value);
    }

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].label = `${selectedMuscle} Progress`;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }
}
