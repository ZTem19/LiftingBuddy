import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { IntervalServiceService } from '../interval-service.service';
import { MuscleGroup } from '../../data types/data-types';
import {
  Chart,
  registerables,
} 
from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-percentage-muscle-group-worked',
  imports: [],
  templateUrl: './percentage-muscle-group-worked.component.html',
  styleUrl: './percentage-muscle-group-worked.component.css'
})
export class PercentageMuscleGroupWorkedComponent implements AfterViewInit{
  @Input() startDate!: Date;
  @Input() endDate!: Date;

  volumeMuscleGroupMap: Map<MuscleGroup, number> = new Map();

  @ViewChild('pieCanvas') pieCanvas!: ElementRef;
  pieChart: any;

  constructor(private intervalService: IntervalServiceService) {}
  

  ngOnChanges(): void 
  {
    // Get volumes for each muscle group to display based on start date and end date from parent
    this.volumeMuscleGroupMap = this.intervalService.GetVolumeMuscleGroup(this.startDate, this.endDate);
  }

  ngAfterViewInit(): void {
    Chart.register(... registerables, ChartDataLabels);
    
    // Define the chart labels (muscle groups)
    const labels = ["Chest", "Back", "Biceps", "Triceps", "Glutes/Quads", "Hamstrings/Calves"];
    // Get data values from a Map that tracks volume per muscle group
    const dataValues = Array.from(this.volumeMuscleGroupMap.values());
    // Calculate the total volume (sum of all data values)
    const total = dataValues.reduce((a, b) => a + b, 0);

    // Custom plugin to draw the total in the bottom-left of the chart
    const totalBottomLeftPlugin = {
      id: 'totalBottomLeftPlugin',
      afterDraw(chart: any) {
        // Get chart context for drawing and chartArea for coordinates
        const { ctx, chartArea } = chart;
        
        // Save the current drawing state
        ctx.save();

        // Set the font style and text appearance
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
    
        // Draw text at the bottom left of the chart area
        const x = chartArea.left + 10;
        const y = chartArea.bottom - 10;
        
        // Draw the text on the canvas
        ctx.fillText(`Total: ${total}`, x, y);

        // Restore the original drawing state
        ctx.restore();
      }
    };

    // Create pie chart using Chart.js
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          // Values for each slice
          data: dataValues,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ],
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            // Position the legend at the top
            position: 'top',
          },
          datalabels: {
            // White text on pie slices
            color: '#fff',
            font: {
              weight: 'bold'
            },
            formatter: (value: number, context: any) => {
              // Show percentage labels on each slice;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${percentage}%`;
            },
          },
        },
      },
      // Activate the plugins
      plugins: [ChartDataLabels, totalBottomLeftPlugin],
    });
  }
}

