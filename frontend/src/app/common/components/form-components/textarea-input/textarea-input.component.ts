/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ValidationInputComponent } from "../validation-input/validation-input.component";
import { AbstractInputComponent } from "../abstract-input.component";
import { Subscription } from "rxjs";

@Component({
    selector: 'tava-textareainput',
    templateUrl: './textarea-input.component.html',
    styleUrls: [
        '../abstract-input.component.scss',
        './textarea-input.component.scss'
    ],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ValidationInputComponent
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextareaInputComponent),
            multi: true,
        }
    ],
    host: {
        '(window:click)': 'clickListening($event)',
        '(window:keydown)': 'keyListening($event)'
    }
})
export class TextareaInputComponent extends AbstractInputComponent implements OnInit, OnDestroy {

    @Input() fieldName: string;
    @Input() formControl: FormControl;
    @Input() placeholder: string;
    @Input() ngClass: string;
    @Input() className: string;
    @Input() rows: number;
    @Input() maxLength: number;

    @Output() byChange: EventEmitter<any>;

    private subscriptionFormControl$: Subscription;

    constructor() {
        super();

        this.fieldName = '';
        this.formControl = new FormControl();
        this.placeholder = '';
        this.ngClass = '';
        this.className = '';
        this.rows = 0;
        this.maxLength = 0;

        this.byChange = new EventEmitter<any>();

        this.subscriptionFormControl$ = new Subscription();
    }

    ngOnInit() {
        this.subscriptionFormControl$ = this.formControl.valueChanges.subscribe(change => {
            this.byChange.emit(change);
            this.isFocused = true;
        })
    }

    clickListening($event: any) {
        this.clickOutside($event, this.fieldName);
    }

    keyListening($event: any) {
        this.tabOutside($event, this.fieldName);
    }

    ngOnDestroy() {
        this.subscriptionFormControl$.unsubscribe();
    }
}