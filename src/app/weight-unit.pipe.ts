import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weightUnit'
})
export class WeightUnitPipe implements PipeTransform 
{

  transform(value: number, usePounds: boolean): string {
    if (typeof value !== 'number') return '';

    const converted = usePounds ? value :  Math.round(value * 0.453592);
    const unit = usePounds ? 'lbs' : 'kg';
    return `${converted} ${unit}`;
  }

}
