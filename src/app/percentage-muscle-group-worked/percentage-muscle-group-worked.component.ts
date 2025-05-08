import { Component, Input, AfterViewInit, ElementRef, ViewChild, OnChanges} from '@angular/core';
import { IntervalServiceService } from '../interval-service.service';
import { MuscleGroup } from '../../data types/data-types';
import {
  Chart,
  registerables,
} 
from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { WeightNumberConverterPipe } from '../weight-number-converter.pipe';

@Component({
  selector: 'app-percentage-muscle-group-worked',
  imports: [WeightNumberConverterPipe],
  templateUrl: './percentage-muscle-group-worked.component.html',
  styleUrl: './percentage-muscle-group-worked.component.css'
})
export class PercentageMuscleGroupWorkedComponent{
  @Input() startDate!: Date;
  @Input() endDate!: Date;
  @Input() usinglbs!: boolean;

  volumeMuscleGroupMap: Map<MuscleGroup, number> = new Map();

  @ViewChild('pieCanvas') pieCanvas!: ElementRef;
  pieChart: Chart | null = null;

  viewInitialized: boolean = false;
  shouldShowChart: boolean = true;
  isLoaded: boolean = true;
  weightNumberConverterPipe: WeightNumberConverterPipe = new WeightNumberConverterPipe();

  constructor(private intervalService: IntervalServiceService) {
    Chart.register(...registerables, ChartDataLabels);
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    // If inputs were already set before view was ready, draw the chart now
    if (this.startDate && this.endDate) {
      this.loadVolumeData();
    }
  }

  ngOnChanges(): void {
    if (this.startDate && this.endDate && this.viewInitialized) {
      this.loadVolumeData();
    }
  }

  async loadVolumeData()
  {
    this.isLoaded = false;
    this.volumeMuscleGroupMap = await this.intervalService.GetVolumeMuscleGroup(this.startDate, this.endDate);
    this.updateChart();
    this.isLoaded = true;
  }

  updateChart(): void {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    
    // Define the chart labels (muscle groups)
    const labels = ["Chest", "Back", "Biceps", "Triceps", "Glutes/Quads", "Hamstrings/Calves"];
    // Get data values from a Map that tracks volume per muscle group
    const rawData = Array.from(this.volumeMuscleGroupMap.values());
     // Convert the values based on usinglbs input
     const convertedData = rawData.map(value =>
      this.weightNumberConverterPipe.transform(value, this.usinglbs)
    );
    // Calculate the total volume (sum of all data values)
    const total = rawData.reduce((a, b) => a + b, 0);

    // Get filtered labels and data (skip zeroes)
    const filteredLabels: string[] = [];
    const filteredData: number[] = [];

    labels.forEach((label, i) => {
      if (convertedData[i] > 0) {
        filteredLabels.push(label);
        filteredData.push(convertedData[i]);
      }
    });

    // Save whether we should render the chart
    this.shouldShowChart = total > 0 && filteredData.length > 0;

    if (!this.shouldShowChart) {
      return; // Skip rendering the chart entirely
    }

    const unitLabel = this.usinglbs ? 'lbs' : 'kg';

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
        ctx.fillStyle = '#f0f0f0';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
    
        // Draw text at the bottom left of the chart area
        const x = chartArea.left + 10;
        const y = chartArea.bottom - 10;
        
        // Draw the text on the canvas
        ctx.fillText(`Total: ${total} ${unitLabel}`, x, y);

        // Restore the original drawing state
        ctx.restore();
      }
    };

    // Create pie chart using Chart.js
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: filteredLabels,
        datasets: [{
          // Values for each slice
          data: filteredData,
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
            labels: {
              color: '#f0f0f0'
            }
          },
          datalabels: {
            color: '#f0f0f0',
            font: {
              weight: 'bold'
            },
            formatter: (value: number, context: any) => {
              // Show percentage labels on each slice;
              const percentage = ((value / total) * 100).toFixed(1);
              const unit = this.usinglbs ? 'lbs' : 'kg';
              return `${value} ${unit}\n(${percentage}%)`;
            },
          },
        },
      },
      // Activate the plugins
      plugins: [ChartDataLabels, totalBottomLeftPlugin],
    });
  }
}