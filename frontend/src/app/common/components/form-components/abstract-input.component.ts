/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";

@Component({
    template: ''
})
export class AbstractInputComponent implements ControlValueAccessor {

    private onChange!: (value: unknown) => void;
    private onTouch!: (value: unknown) => void;

    input!: unknown;

    constructor() {
        //
    }

    writeValue(input: unknown) {
        this.input = input;
    }
    registerOnChange(fn: any) {
        this.onChange = fn;
    }
    registerOnTouched(fn: any) {
        this.onTouch = fn;
    }
}