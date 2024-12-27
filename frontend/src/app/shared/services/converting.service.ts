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
        const hours = time.getHours() < 10 ? `0${time.getHours()}` : `${time.getHours()}`;
        const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
        return `${hours}:${minutes}`
    }
}