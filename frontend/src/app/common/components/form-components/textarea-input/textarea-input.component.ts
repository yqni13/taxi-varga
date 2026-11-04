import { CommonModule } from "@angular/common";
import { Component, effect, signal } from "@angular/core";
import { ValidationInputComponent } from "../validation-input/validation-input.component";
import { AbstractInputComponent } from "../abstract-input.component";
import { FormField } from "@angular/forms/signals";

@Component({
    selector: 'tava-textareainput',
    imports: [
        CommonModule,
        FormField,
        ValidationInputComponent
    ],
    templateUrl: './textarea-input.component.html',
    styleUrls: [
        '../abstract-input.component.scss',
        './textarea-input.component.scss'
    ]
})
export class TextareaInputComponent extends AbstractInputComponent {

    readonly rows = signal(0);
    readonly maxLength = signal(0);
    readonly lengthLimit = signal(0);

    constructor() {
        super();
        effect(() => {
            this.handleInputChanges(this.field().value());
        });
    }
}