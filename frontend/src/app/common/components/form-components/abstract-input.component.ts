import { Component, computed, input, output, signal } from "@angular/core";
import { Field, FieldState } from "@angular/forms/signals";

@Component({
    template: '',
    host: {
        '(focusin)': 'onFocusIn()',
        '(focusout)': 'onFocusOut($event)'
    }
})
export class AbstractInputComponent {

    readonly fieldState = input.required<FieldState<string | number>>();
    readonly fieldName = input.required<string>();
    readonly placeholder = input('');
    readonly className = input('');
    readonly ngClass = input('');

    readonly byChange = output<unknown>();

    readonly isFocused = signal(false);
    readonly hasErrorOnFocus = computed(() => this.hasErrorOnFocusList());

    readonly errorOnFocusList = ['maxlength'];

    readonly hasError = computed(() => 
        this.field().invalid()
        && (this.field().dirty() || this.field().touched())
    );

    get field(): Field<string> {
        return this.fieldState().fieldTree as unknown as Field<string>;
    }

    hasErrorOnFocusList(): boolean {
        let hasErrorFromList = false;
        this.field().errors().forEach((entry) => {
            if(this.errorOnFocusList.includes(entry.kind)) {
                hasErrorFromList = true;
            }
        })

        return hasErrorFromList;
    }

    handleInputChanges(value: string|number) {
        this.byChange.emit(value);
    }

    onFocusIn() {
        this.isFocused.set(true);
    }

    onFocusOut(event: FocusEvent) {
        const host = event.currentTarget as HTMLElement;
        if (!host.contains(event.relatedTarget as Node | null)) {
            this.isFocused.set(false);
        }
    }
}