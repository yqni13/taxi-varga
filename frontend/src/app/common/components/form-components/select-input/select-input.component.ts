import { CommonModule } from "@angular/common";
import { Component, effect, input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ValidationInputComponent } from "../validation-input/validation-input.component";
import { AbstractInputComponent } from "../abstract-input.component";
import { FormField } from "@angular/forms/signals";

@Component({
    selector: 'tava-selectinput',
    imports: [
        CommonModule,
        FormField,
        TranslateModule,
        ValidationInputComponent
    ],
    templateUrl: './select-input.component.html',
    styleUrls: [
        '../abstract-input.component.scss',
        './select-input.component.scss',
    ]
})
export class SelectInputComponent extends AbstractInputComponent {

    readonly options = input<unknown>({});
    readonly optionsTranslateRoot = input('');

    protected isSelected = false;

    constructor() {
        super();
        effect(() => this.handleSelectionChanges(this.field().value()))
    }

    handleSelectionChanges(value: string|number) {
        if (!value || value === '') {
            this.isSelected = true;
            this.isFocused.set(false);
        }
    }

    selectOption(option: Event) {
        this.byChange.emit(option);
        this.isFocused.set(false);
        this.isSelected = true;
    }
}