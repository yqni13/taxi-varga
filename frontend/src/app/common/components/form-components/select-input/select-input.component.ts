import { CommonModule } from "@angular/common";
import { Component, EventEmitter, forwardRef, Input, Output, ChangeDetectionStrategy } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ValidationInputComponent } from "../validation-input/validation-input.component";
import { AbstractInputComponent } from "../abstract-input.component";

@Component({
    selector: 'tava-selectinput',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        ValidationInputComponent
    ],
    templateUrl: './select-input.component.html',
    styleUrls: [
        '../abstract-input.component.scss',
        './select-input.component.scss',
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectInputComponent),
            multi: true,
        }
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        '(window:click)': 'clickListening($event)',
        '(window:keydown)': 'keyListening($event)'
    }
})
export class SelectInputComponent extends AbstractInputComponent {

    @Input() fieldName: string;
    @Input() formControl: FormControl;
    @Input() placeholder: string;
    @Input() ngClass: string;
    @Input() className: string;
    @Input() options: any;
    @Input() optionsTranslateRoot: string;

    @Output() byChange: EventEmitter<any>;

    constructor() {
        super();

        this.fieldName = '';
        this.formControl = new FormControl();
        this.placeholder = '';
        this.ngClass = '';
        this.className = '';
        this.options = [];
        this.optionsTranslateRoot = '';
        this.byChange = new EventEmitter<any>();
    }

    selectOption(option: Event) {
        this.byChange.emit(option);
        this.isFocused = false;
    }

    clickListening($event: any) {
        this.clickOutside($event, this.fieldName);
    }

    keyListening($event: any) {
        this.tabOutside($event, this.fieldName);
    }
}