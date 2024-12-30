import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    standalone: true,
    name: 'durationFormat'
})
export class DurationFormatPipe implements PipeTransform {

    transform(value: number): string {
        const hours = (value >= 60)
            ? `${Math.floor(value / 60)} h `
            : '';
        const minutes = (value >= 60)
            ? `${value % 60} min`
            : `${value} min`;
        return `${hours}${minutes}`;
    }
}