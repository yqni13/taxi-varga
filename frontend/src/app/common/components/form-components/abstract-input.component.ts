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
    isFocused: boolean;

    constructor() {
        this.isFocused = false;
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

    clickOutside($event: any, fieldName: string) {
        if($event.target?.id === `tava-${fieldName}`) {
            this.isFocused = true;
        } else {
            this.isFocused = false;
        }
    }

    tabOutside($event: any, fieldName: string) {
        if($event.key === 'Tab' && ($event.target?.id === `tava-${fieldName}`)) {
            this.isFocused = false;
        }
    }
}