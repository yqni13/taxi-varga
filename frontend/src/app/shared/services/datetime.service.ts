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

    getTimeFromTotalMinutes(time: number): string {
        const hours = (time >= 60)
            ? Math.floor(time / 60) >= 10
                ? Math.floor(time / 60)
                : `0${Math.floor(time / 60)}`
            : '00';
        const minutes = (time % 60 > 9)
            ? time % 60
            : `0${time}`;
        return `${hours}:${minutes}`;
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

    hasSameDate(start: string, end: string): boolean {
        return (new Date(start).getDate()) === (new Date(end).getDate());
    }

    getTimeFromLanguage(time: string, lang: string): string {
        if(lang === 'de') {
            return `${time} Uhr`;
        }
        const edit = new Date(`2025-01-01T${time}:00`);
        const minutes = edit.getMinutes() < 10 ? `0${edit.getMinutes()}` : edit.getMinutes().toString();

        if(edit.getHours() >= 12) {
            const hoursEng = edit.getHours() - 12;
            const hours = hoursEng < 10 ? `0${hoursEng}` : `${hoursEng}`;
            return `${hours}:${minutes} p.m.`;
        }
        const hours = edit.getHours() < 10 ? `0${edit.getHours()}` : `${edit.getHours()}`;
        return `${hours}:${minutes} a.m.`;
    }

    getTimeInTotalMinutes(time: string): number {
        if(time[0] === '2' && time[1] === '4') {
            return 24 * 60;
        }
        const hours = new Date(`2025-01-01T${time}:00`).getHours();
        const minutes = new Date(`2025-01-01T${time}:00`).getMinutes();
        return (hours * 60) + minutes;
    }

    getTimeDifferenceAsNumber(start: string, end: string): number {
        const asString = this.getTimeDifferenceAsString(start, end);
        return this.getTimeInTotalMinutes(asString);
    }

    getTimeDifferenceAsString(start: string, end: string): string {
        const difference = new Date(end).getTime() - new Date(start).getTime();
        const fromMillisecondsToMinutes = (1 / 1000 / 60);
        return this.getRoundUpTime30MinSteps((difference * fromMillisecondsToMinutes), true);
    }

    getRoundUpTime30MinSteps(time: string | number, isNumber: boolean): string {
        const minutesTotal = isNumber ? Number(time) : this.getTimeInTotalMinutes(String(time));
        const roundUpTime = (minutesTotal % 30) > 0
            ? Math.ceil(minutesTotal / 30) * 30
            : minutesTotal;
        
        const minutes = (roundUpTime % 60) === 30 ? '30' : '00';
        const hours = (roundUpTime / 60) < 10
            ? `0${Math.floor(roundUpTime / 60)}`
            : `${Math.floor(roundUpTime / 60)}`;

        return `${hours}:${minutes}`;
    }


}