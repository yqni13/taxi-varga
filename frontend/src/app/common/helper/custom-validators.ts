import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const invalidTenancyValueValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const val = control?.value as string;
        if(val.includes(',') || val.includes('.')) {
            return { invalidTenancyValue: true };
        }
        return null;
    }
}

export const requiredTenancyValueValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        if((control?.value as string) === '') {
            return { requiredTenancyValue: true };
        }
        return null;
    }
}

export const invalidTenancyLimitValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const val = control?.value as number;
        if(control?.value !== '' && val < 1 || val > 24) {
            return { invalidTenancyLimit: true };
        }
        return null;
    }
}
