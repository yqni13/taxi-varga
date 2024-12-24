import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ConvertingService {

    constructor() {
        //
    }

    getDateFromTimestamp(timestamp: string): string {
        const date = new Date(timestamp);
        return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
    }

    getTimeFromTimestamp(timestamp: string): string {
        const time = new Date(timestamp);
        return time.getHours() !== 0 
            ? `${time.getHours()} h ${time.getMinutes()} min`
            : `${time.getMinutes()} min`
    }
}