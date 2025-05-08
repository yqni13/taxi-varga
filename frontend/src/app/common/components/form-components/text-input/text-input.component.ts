/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AbstractInputComponent } from "../abstract-input.component";
import { Observable, Subscription } from "rxjs";
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
    @Input() readonly: boolean;
    @Input() placeholder: string;
    @Input() inputType: string;
    @Input() className: string;
    @Input() ngClass: string;
    @Input() minValString: string;
    @Input() minStringObservable: Observable<string>;
    @Input() maxStringObservable: Observable<string>;
    @Input() minValNumber: number | null;
    @Input() maxValNumber: number | null;

    @Output() byChange: EventEmitter<any>;

    protected classNameWarningIcon: string;
    protected minVal: unknown;
    protected maxVal: unknown;

    private subscriptionFormControl$: Subscription;
    private subscriptionMinValString$: Subscription;
    private subscriptionMaxValString$: Subscription;

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
        this.minStringObservable = new Observable<string>();
        this.maxStringObservable = new Observable<string>();
        this.minValNumber = null;
        this.maxValNumber = null;
        this.byChange = new EventEmitter<any>();
        this.classNameWarningIcon = '';
        this.subscriptionFormControl$ = new Subscription();
        this.subscriptionMinValString$ = new Subscription();
        this.subscriptionMaxValString$ = new Subscription();
    }
    
    ngOnInit() {
        this.subscriptionFormControl$ = this.formControl.valueChanges.subscribe(change => {
            this.byChange.emit(change);
            this.isFocused = true;
        })
        this.subscriptionMinValString$ = this.minStringObservable.subscribe(val => {
            this.minVal = val ?? this.minValNumber;
        })
        this.subscriptionMaxValString$ = this.maxStringObservable.subscribe(val => {
            this.maxVal = val ?? this.maxValNumber;
        })
        this.configWarningIconByInputType();
        this.configMinMaxValues();
    }

    configMinMaxValues() {
        if(this.inputType === 'datetime-local' && this.minVal !== '') {
            this.minVal = this.minValString;
        } else if(this.inputType === 'number') {
            this.minVal = this.minValNumber;
            this.maxVal = this.maxValNumber;
        }
    }

    configWarningIconByInputType() {
        switch(this.inputType) {
            case('datetime-local'): {
                this.classNameWarningIcon = 'tava-warning-input-datetime-local';
                break;
            }
            case('time'): {
                this.classNameWarningIcon = 'tava-warning-input-time';
                break;
            }
            default:
                this.classNameWarningIcon = 'tava-warning-input-text';
        }
    }

    ngOnDestroy() {
        this.subscriptionFormControl$.unsubscribe();
        this.subscriptionMinValString$.unsubscribe();
        this.subscriptionMaxValString$.unsubscribe();
    }
}