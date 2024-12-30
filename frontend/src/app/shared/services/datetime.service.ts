import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DateTimeService {

    getDateFromTimestamp(timestamp: string, stampFormat?: boolean): string {
        const date = new Date(timestamp);
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate().toString();
        const month = date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : (date.getMonth()+1).toString();
        
        if(stampFormat) {
            return `${date.getFullYear()}-${month}-${day}`;
        }
        
        return `${day}.${month}.${date.getFullYear()}`
    }

    getTimeFromTimestamp(timestamp: string): string {
        const time = new Date(timestamp);
        const hours = time.getHours() < 10 ? `0${time.getHours()}` : `${time.getHours()}`;
        const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
        return `${hours}:${minutes}`
    }

    getTodayStartingTimestamp(): string {
        const today = new Date();
        const date = this.getDateFromTimestamp(today.toString(), true);
        return `${date}T00:00:00`;
    }
}