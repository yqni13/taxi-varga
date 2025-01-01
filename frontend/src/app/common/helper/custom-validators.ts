import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// TODO(yqni13): remove unused validators and flatrate html elements
// export const invalidTenancyValueValidator = (): ValidatorFn => {
//     return (control: AbstractControl): ValidationErrors | null => {
//         const val = control?.value as string;
//         if(val.includes(',') || val.includes('.')) {
//             return { invalidTenancyValue: true };
//         }
//         return null;
//     }
// }

// export const requiredTenancyValueValidator = (): ValidatorFn => {
//     return (control: AbstractControl): ValidationErrors | null => {
//         if((control?.value as string) === '') {
//             return { requiredTenancyValue: true };
//         }
//         return null;
//     }
// }

// export const invalidTenancyLimitValidator = (): ValidatorFn => {
//     return (control: AbstractControl): ValidationErrors | null => {
//         const val = control?.value as number;
//         if(control?.value !== '' && val < 1 || val > 24) {
//             return { invalidTenancyLimit: true };
//         }
//         return null;
//     }
// }

export const invalidTenancyUpperLimitValidator = (maxLimit: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const currentDateTime = (new Date(control?.value).getTime());
        const limitDateTime = (new Date(maxLimit).getTime());
        if(currentDateTime > limitDateTime) {
            return { invalidTenancyUpperLimit: true };
        }
        return null;
    }
}

export const invalidTenancyLowerLimitValidator = (minLimit: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const currentDateTime = (new Date(control?.value).getTime());
        const limitDateTime = (new Date(minLimit).getTime());
        if(currentDateTime < limitDateTime) {
            return { invalidTenancyLowerLimit: true };
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
