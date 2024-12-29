/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AbstractInputComponent } from "../abstract-input.component";
import { Subscription } from "rxjs";
import { ValidationInputComponent } from "../validation-input/validation-input.component";

@Component({
    selector: 'tava-textinput',
    templateUrl: './text-input.component.html',
    styleUrl: './text-input.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ValidationInputComponent
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextInputComponent),
            multi: true,
        }
    ]
})
export class TextInputComponent extends AbstractInputComponent implements OnInit, OnDestroy {

    @Input() fieldName: string;
    @Input() formControl: FormControl;
    @Input() readonly: boolean;
    @Input() placeholder: string;
    @Input() inputType: string;
    @Input() className: string;
    @Input() ngClass: string;

    @Output() byChange: EventEmitter<any>;

    protected classNameWarningIcon: string;

    private subscription$: Subscription;

    constructor() {
        super();

        this.fieldName = '';
        this.formControl = new FormControl();
        this.readonly = false;
        this.placeholder = '';
        this.inputType = '';
        this.className = '';
        this.ngClass = '';
        this.byChange = new EventEmitter<any>();
        this.classNameWarningIcon = '';
        this.subscription$ = new Subscription();
    }
    
    ngOnInit() {
        this.subscription$ = this.formControl.valueChanges.subscribe(change => {
            this.byChange.emit(change);
        })
        this.configWarningIconByInputType();
    }

    configWarningIconByInputType() {
        switch(this.inputType) {
            case('datetime-local'): {
                this.classNameWarningIcon = 'tava-warning-input-datetime-local';
                break;
            }
            default:
                this.classNameWarningIcon = 'tava-warning-input-text';
        }
    }

    ngOnDestroy() {
        this.subscription$.unsubscribe();
    }
}