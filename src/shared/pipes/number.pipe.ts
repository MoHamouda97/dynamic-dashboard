import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "checkNumber",
  standalone: true,
})
export class NumberPipe implements PipeTransform {
  transform(value: any): any {
    if (!value && value != 0) return "_";

    return `${value}`;
  }
}
