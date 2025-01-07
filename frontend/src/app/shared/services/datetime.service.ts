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

    getTodayStartingTimestamp(today: boolean, selectedDate?: string): string {
        const timestamp = !today && selectedDate ? new Date(selectedDate) : new Date();
        const date = this.getDateFromTimestamp(timestamp.toString(), true);
        return `${date}T00:00`;
    }

    get24HoursRestrictionTimestamp(start: string): string {
        const basis = Math.floor((new Date(start)).getTime() / 1000);
        const limit = new Date((basis + (24 * 60 * 60)) * 1000);
        return `${this.getDateFromTimestamp(new Date(limit).toString(), true)}T${this.getTimeFromTimestamp(new Date(limit).toString())}`;
    }

    getTimeDifferenceInHoursRoundUp(start: string, end: string): number {
        const difference = new Date(end).getTime() - new Date(start).getTime();
        const fromMillisecondsToHours = (1 / 1000 / 60 / 60);
        return Math.ceil(difference * fromMillisecondsToHours);
    }

    hasSameDate(start: string, end: string): boolean {
        return (new Date(start).getDate()) === (new Date(end).getDate());
    }
}