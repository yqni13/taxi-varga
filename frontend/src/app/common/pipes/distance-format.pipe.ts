import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    standalone: true,
    name: 'distanceFormat'
})
export class DistanceFormatPipe implements PipeTransform {

    transform(value: number): string {
        return `${value} km`;
    }
}