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

    getCurrentTimeInMilliseconds(): number {
        return new Date().getTime();
    }

    getTimeFromTotalHours(time: number): string {
        const hours = (time < 10) ? `0${time}` : `${time}`;
        return `${hours}:00`;
    }

    getTimeFromTotalMinutes(time: number): string {
        const hours = (time >= 60)
            ? Math.floor(time / 60) >= 10
                ? Math.floor(time / 60)
                : `0${Math.floor(time / 60)}`
            : '00';
        const minutes = (time % 60 > 9)
            ? time % 60
            : `0${time % 60}`;
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

    getRestrictionTimestampHoursBased(start: string, restrictionHours: number): string {
        const basis = Math.floor((new Date(start)).getTime() / 1000);
        const limit = new Date((basis + (restrictionHours * 60 * 60)) * 1000);
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
        /**
         * @param {string} time: '00:00'
         */
        const hours = time[0] === '0' ? Number(time[1]) : Number(`${time[0]}${time[1]}`);
        const minutes = time[3] === '0' ? Number(time[3]) : Number(`${time[3]}${time[4]}`);
        return (hours * 60) + minutes;
    }

    getTimeDifferenceNoLimit(start: string, end: string): number {
        const difference = new Date(end).getTime() - new Date(start).getTime();
        const fromMillisecondsToMinutes = (1 / 1000 / 60);
        return Number((difference * fromMillisecondsToMinutes).toFixed(1));
    }

    getTimeDifferenceAsNumber(start: string, end: string): number {
        const asString = this.getTimeDifferenceAsString(start, end);
        return this.getTimeInTotalMinutes(asString);
    }

    getTimeDifferenceAsString(start: string, end: string, rawResult?: boolean): string {
        const difference = new Date(end).getTime() - new Date(start).getTime();
        const fromMillisecondsToMinutes = (1 / 1000 / 60);
        let result;
        if(rawResult) {
            result = this.getTimeFromTotalMinutes((difference * fromMillisecondsToMinutes) as number);
        } else {
            result = this.getRoundUpTime30MinSteps(((difference * fromMillisecondsToMinutes) as number), true);
        }
        return result;
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

    configHourForPayload(time: string): number {
        // we expect hh:mm with leading 0
        const hours = Number(time.substring(0, time.indexOf(':')));
        const minutes = Number(time.substring((time.indexOf(':')+1)));
        // business hours = 04:00 - 12:00 ==> 12:01 = after hours
        return (hours === 12 && minutes > 0) ? hours+1 : hours;
    }
}