import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    standalone: true,
    name: 'durationFormat'
})
export class DurationFormatPipe implements PipeTransform {

    transform(valInMinutes: number): string {
        const hours = (valInMinutes >= 60)
            ? Math.floor(valInMinutes / 60) >= 10
                ? Math.floor(valInMinutes / 60)
                : `0${Math.floor(valInMinutes / 60)}`
            : '00';
        const minutes = (valInMinutes % 60 > 9)
            ? valInMinutes % 60
            : `0${valInMinutes}`;
        return `${hours}:${minutes} h`;
    }
}