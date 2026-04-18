import { FormControl } from "@angular/forms"

export interface MetaFormRequest {
    gender: FormControl<string>,
    title: FormControl<string>,
    firstName: FormControl<string>,
    lastName: FormControl<string>,
    phone: FormControl<string>,
    email: FormControl<string>,
    note: FormControl<string>
}

export interface MetaFormValidationData {
    titleMaxLength: number,
    firstNameMaxLength: number,
    lastNameMaxLength: number,
    phoneMaxLength: number,
    emailMaxLength: number,
    noteMaxLength: number
}