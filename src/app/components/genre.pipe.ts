import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'genre'})
export class GenrePipe implements PipeTransform {
  transform(value: string, args: string[]): any {
   
   
    if (!value) return value;

    if(value == "1") {
        value = "garçon";
    }
    if (value == "2") {
        value = "fille";
    }

    return value;
  }
}