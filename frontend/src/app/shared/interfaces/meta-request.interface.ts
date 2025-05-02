import { FormControl } from "@angular/forms"

export declare interface MetaFormRequest {
    gender: FormControl<string>,
    title: FormControl<string>,
    firstName: FormControl<string>,
    lastName: FormControl<string>,
    phone: FormControl<string>,
    email: FormControl<string>,
    note: FormControl<string>
}