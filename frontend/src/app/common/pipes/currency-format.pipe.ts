import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    standalone: true,
    name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {

    transform(value: number | string ): string {
        return `${(value as string)},00 EUR`
    }
}