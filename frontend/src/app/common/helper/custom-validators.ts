import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
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

export const negativeCurrentDateTimeValidator = (datetimeService: DateTimeService) : ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        /**
         * @description datetime value must not be in the past compared to current datetime
         * @param {string} currentDateTime
         */
        const currentDateTime = new Date().toString();
        const difference = datetimeService.getTimeDifferenceNoLimit(currentDateTime, control?.value);
        if(difference < -1) {
            return { negativeCurrentDateTime: true };
        }
        return null;
    }
}

export const negativeFixedDateTimeValidator = (datetimeService: DateTimeService, fixedDateTime: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        /**
         * @description datetime value must not be in the past compared to certain datetime
         * @param {string} fixedDateTime
         */
        const difference = datetimeService.getTimeDifferenceNoLimit(fixedDateTime, control?.value);
        if(difference < -1) {
            return { negativeFixedDateTime: true };
        }
        return null;
    }
}

export const priorityValidator = (validators: ValidatorFn[]): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        /**
         * @description Add multiple validators ordered by priority. First validator to trigger ends loop without
         * triggering remaining validators.
         * 
         * @example
         * CustomValidators.priorityValidator(
         *      validateNotNegativeVal(),     
         *      validateNotSmallerThan3(),
         * )
         * val = -1
         * @fires only validateNotNegativeVal()
         */
        for (const validator of validators) {
            const result = validator(control);
            if(result) {
                return result;
            }
        }
        return null;
    }
}

export const emptyAddressSelectValidator = (placeControl: FormControl) : ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        if(control?.value.length !== 0 && !placeControl.value) {
            return { emptyAddressSelect: true };
        }
        return null;
    }
}