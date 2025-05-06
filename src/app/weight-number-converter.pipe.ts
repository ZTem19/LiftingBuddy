import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weightNumberConverter'
})
export class WeightNumberConverterPipe implements PipeTransform {
  transform(value: number, usinglbs: boolean): number {
    if (typeof value !== 'number') return value;
    return usinglbs ?  value : Math.round(value * 0.453592);
  }
}
