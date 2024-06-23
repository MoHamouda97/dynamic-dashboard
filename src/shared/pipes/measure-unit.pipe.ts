import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "measureUnit",
  standalone: true,
})
export class MeasureUnitPipe implements PipeTransform {
  transform(value: string | number, unit?: string, unitType?: any): string {
    if (!value && value != 0) return "_";
    const measureUnit = getMeasureUnit(unit, unitType);
    return measureUnit ? `${value} ${measureUnit}` : `${value}`;
  }
}

export function getMeasureUnit(unit?: string, unitType?: any) {
  if (unit === "Percentage") {
    return "%";
  }
  if (unit === "Numeric" && unitType?.display?.name) {
    return unitType.display.name;
  }
  return "";
}
