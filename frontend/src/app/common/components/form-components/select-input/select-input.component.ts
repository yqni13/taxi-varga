/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, forwardRef, HostListener, Input, Output } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ValidationInputComponent } from "../validation-input/validation-input.component";
import { AbstractInputComponent } from "../abstract-input.component";

@Component({
    selector: 'tava-selectinput',
    templateUrl: './select-input.component.html',
    styleUrl: './select-input.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        ValidationInputComponent
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectInputComponent),
            multi: true,
        }
    ]
})
export class SelectInputComponent extends AbstractInputComponent {

    @HostListener('window:click', ['$event']) 
    clickListening($event: any) {
        this.clickOutside($event, this.fieldName);
    }

    @HostListener('window:keydown', ['$event'])
    keyListening($event: any) {
        this.tabOutside($event, this.fieldName);
    }

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
}