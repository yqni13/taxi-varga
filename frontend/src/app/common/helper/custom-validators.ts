import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { DateTimeService } from "../../shared/services/datetime.service";
import { ServiceRoute } from "../../api/routes/service.route.enum";
import { DatetimeOption } from "../../shared/enums/datetime-options.enum";
import { InvalidBHParams, StayTimeValidatorParams, TimeRangeValidatorParams } from "../../shared/interfaces/custom-validators.interface";
import { SchemaPath, validate } from "@angular/forms/signals";


export const invalidTenancyUpperLimitValidator = (maxLimit: string, service: ServiceRoute): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const currentDateTime = (new Date(control?.value).getTime());
        const limitDateTime = (new Date(maxLimit).getTime());
        if(currentDateTime > limitDateTime && service === ServiceRoute.FLATRATE) {
            return { invalidTenancyUpperLimit: true };
        }
        if(currentDateTime > limitDateTime && service === ServiceRoute.GOLF) {
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

export const phoneRegExValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const cleanedNr = (control?.value as string).replaceAll(' ', '');
        const whitelist = /^\+?[0-9]+$/;
        if(cleanedNr !== '' && !whitelist.test(cleanedNr) ) {
            return { invalidPhoneChar: true };
        }
        return null;
    }
}

export const maxStayTimeValidator = (params: StayTimeValidatorParams) : ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const time = params.service.getTimeInTotalMinutes(control?.value);
        if(time > (60 * params.maxHours)) {
            return { [params.validation]: true };
        }
        return null;
    }
}

export const invalidTimeRangeByHoursValidator = (param: TimeRangeValidatorParams): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        let time = 0;
        if (param.format === DatetimeOption.HHMM) {
            time = param.service.getTimeInTotalMinutes(control?.value);
        } else if (param.format === DatetimeOption.FULL) {
            time = param.service.getTimeInTotalMinutes(param.service.getTimeFromTimestamp(control?.value));
        }
        if (time < (60 * param.startHour) || time > (60 * param.endHour)) {
            return { [param.validation]: true };
        }
        return null;
    }
}

export const invalidQuickPickupValidator = (service: DateTimeService): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        let time = 0;
        time = service.getTimeInTotalMinutes(control?.value);
        if (time < (60 * 4)
        || (time > (60 * 10) && time < (60 * 14))
        || time > (60 * 19)) {
            return { invalidQuickOriginTimeOuter: true };
        }
        return null;
    }
}

export function invalidBH(path: SchemaPath<string>, params: InvalidBHParams) {
    validate(path, ({value}) => {
        let time = 0;
        if (params.format === DatetimeOption.HHMM) {
            time = params.dtServ.getTimeInTotalMinutes(value());
        } else if (params.format === DatetimeOption.FULL) {
            time = params.dtServ.getTimeInTotalMinutes(params.dtServ.getTimeFromTimestamp(value()));
        }

        if (time < (60 * params.options.min) || time > (60 * params.options.max)) {
            if (params.format === DatetimeOption.HHMM) {
                return { kind: 'invalidBHTimeOnly' };
            } else if (params.isPickup) {
                return params.options.max === 12 ? { kind: 'invalidBusinessHours12' } : { kind: 'invalidBusinessHours17' };
            } else {
                return { kind: 'invalidBusinessReturn' };
            }
        }
        return null;
    })
}
// export const invalidBusinessHoursValidator = (param: InvalidBHValidatorParams) : ValidatorFn => {
//     return (control: AbstractControl): ValidationErrors | null => {
//         let time = 0;
//         if(param.format === DatetimeOption.HHMM) {
//             time = param.service.getTimeInTotalMinutes(control?.value);
//         } else if(param.format === DatetimeOption.FULL) {
//             time = param.service.getTimeInTotalMinutes(param.service.getTimeFromTimestamp(control?.value));
//         }
//         if(time < (60 * param.startHour) || time > (60 * param.endHour)) {
//             if(param.format === DatetimeOption.HHMM) {
//                 return { invalidBHTimeOnly: true };
//             } else if(param.isPickup) {
//                 return param.endHour === 12 ? { invalidBusinessHours12: true } : { invalidBusinessHours17: true };
//             } else {
//                 return { invalidBusinessReturn: true };
//             }
//         }
//         return null;
//     }
// }

export function negativeCurrDateTime(path: SchemaPath<string>, dtService: DateTimeService) {
    validate(path, ({value}) => {
        const currentDateTime = new Date().toString();
        const difference = dtService.getTimeDifferenceNoLimit(currentDateTime, value());
        if(difference < -1) {
            return { kind: 'negativeCurrentDateTime' };
        }
        return null;
    })
}
// export const negativeCurrentDateTimeValidator = (datetimeService: DateTimeService) : ValidatorFn => {
//     return (control: AbstractControl): ValidationErrors | null => {
//         /**
//          * @description datetime value must not be in the past compared to current datetime
//          * @param {string} currentDateTime
//          */
//         const currentDateTime = new Date().toString();
//         const difference = datetimeService.getTimeDifferenceNoLimit(currentDateTime, control?.value);
//         if(difference < -1) {
//             return { negativeCurrentDateTime: true };
//         }
//         return null;
//     }
// }

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
export const priorityValidator = (validators: ValidatorFn[]): ValidatorFn => {
    
    // !!! not necessary anymore with new validation system - only 1 active validation + order !!!
    
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

export const emptyAddressSelectValidator = (placeControl: FormControl): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        if(control?.value.length !== 0 && !placeControl.value) {
            return { emptyAddressSelect: true };
        }
        return null;
    }
}

export const missingZipcodeAddress2Airport = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        if(control && (!control.value.zipCode ||  control?.value.zipCode === '')) {
            return { missingZipcode: true };
        }
        return null;
    }
}
