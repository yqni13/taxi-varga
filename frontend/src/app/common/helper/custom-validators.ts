import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { DateTimeService } from "../../shared/services/datetime.service";
import { ServiceOptions } from "../../shared/enums/service-options.enum";

export const invalidTenancyUpperLimitValidator = (maxLimit: string, service: ServiceOptions): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const currentDateTime = (new Date(control?.value).getTime());
        const limitDateTime = (new Date(maxLimit).getTime());
        if(currentDateTime > limitDateTime && service === ServiceOptions.FLATRATE) {
            return { invalidTenancyUpperLimit: true };
        }
        if(currentDateTime > limitDateTime && service === ServiceOptions.GOLF) {
            return { invalidStayUpperLimit: true };
        }
        return null;
    }
}

export const invalidTenancyLowerLimitValidator = (minLimit: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const min3Hours = (3 * 60 * 60 * 1000);
        const currentDateTime = (new Date(control?.value).getTime());
        const limitDateTime = (new Date(minLimit).getTime()) + min3Hours;
        if(currentDateTime < limitDateTime) {
            return { invalidTenancyLowerLimit: true };
        }
        return null;
    }
}

export const invalidZeroTenancyValidator = (datetimeService: DateTimeService, start: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        if(control?.value !== '' && control?.value !== null) {
            const difference = datetimeService.getTimeDifferenceAsNumber(start, control?.value)
            if(difference === 0) {
                return { invalidZeroTenancy: true };
            }
        }
        return null;
    }
}

export const requiredTenancyValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        if(control?.value === '' || control?.value === null) {
            return { requiredTenancy: true };
        }
        return null;
    }
}

export const maxLatencyValidator = (datetimeService: DateTimeService) : ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const time = datetimeService.getTimeInTotalMinutes(control?.value);
        if(time > (60 * 6)) {
            return { maxLatency: true };
        }
        return null;
    }
}

export const invalidBusinessHoursValidator = (datetimeService: DateTimeService) : ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const time = datetimeService.getTimeInTotalMinutes(datetimeService.getTimeFromTimestamp(control?.value));
        if(time < (60 * 4) || time > (60 * 12)) {
            return { invalidBusinessHours: true };
        }
        return null;
    }
}

export const negativeDateTimeValidator = (datetimeService: DateTimeService) : ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const difference = datetimeService.getTimeDifferenceNoLimit(new Date().toString(), control?.value);
        if(difference < -1) {
            return { negativeDateTime: true };
        }
        return null;
    }
}

export const negativeDateTimeEndValidator = (datetimeService: DateTimeService, datetimeStart: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const difference = datetimeService.getTimeDifferenceNoLimit(datetimeStart, control?.value);
        if(difference < -1) {
            return { negativeDatetimeEnd: true };
        }
        return null;
    }
}

export const priorityValidator = (validators: ValidatorFn[]): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        for (const validator of validators) {
            const result = validator(control);
            if(result) {
                return result;
            }
        }
        return null;
    }
}