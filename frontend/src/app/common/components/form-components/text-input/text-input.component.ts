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
    @Input() minValString: string;
    @Input() maxValString: string;
    @Input() minValNumber: number | null;
    @Input() maxValNumber: number | null;

    @Output() byChange: EventEmitter<any>;

    protected classNameWarningIcon: string;
    protected minVal: unknown;
    protected maxVal: unknown;

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
        this.minValString = '';
        this.maxValString = '';
        this.minValNumber = null;
        this.maxValNumber = null;
        this.byChange = new EventEmitter<any>();
        this.classNameWarningIcon = '';
        this.subscription$ = new Subscription();
    }
    
    ngOnInit() {
        this.subscription$ = this.formControl.valueChanges.subscribe(change => {
            this.byChange.emit(change);
        })
        this.configWarningIconByInputType();
        this.configMinMaxValues();
    }

    configMinMaxValues() {
        switch(this.inputType) {
            case('datetime-local'): {
                this.minVal = this.minValString;
                this.maxVal = this.maxValString;
                break;
            }
            case('number'): {
                this.minVal = this.minValNumber;
                this.maxVal = this.maxValNumber;
                break;
            }
        }
    }

    configWarningIconByInputType() {
        switch(this.inputType) {
            case('datetime-local'): {
                this.classNameWarningIcon = 'tava-warning-input-datetime-local';
                break;
            }
            case('number'): {
                this.classNameWarningIcon = 'tava-warning-input-number';
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