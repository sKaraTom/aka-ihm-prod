import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'capitalize'})
export class CapitalizePipe implements PipeTransform {
  
  public transform(value: string, args: string[]): any {
    if (!value) return value;

    return value.toLowerCase().replace(/(^.|-.)/g,function(e){return e.toUpperCase()});
  }
}