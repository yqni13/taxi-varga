import { Component, OnInit, effect, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AbstractInputComponent } from "../abstract-input.component";
import { ValidationInputComponent } from "../validation-input/validation-input.component";
import { FormField } from "@angular/forms/signals";

@Component({
    selector: 'tava-textinput',
    imports: [
        CommonModule,
        FormField,
        ValidationInputComponent
    ],
    templateUrl: './text-input.component.html',
    styleUrls: [
        '../abstract-input.component.scss',
        './text-input.component.scss',
    ]
})
export class TextInputComponent extends AbstractInputComponent implements OnInit {

    readonly inputType = input('text');
    readonly minVal = input<string|number>('');
    readonly maxVal = input<string|number>('');
    // @Input() minValString = '';
    // @Input() minStringObservable = new Observable<string>();
    // @Input() maxStringObservable = new Observable<string>();
    // @Input() minValNumber: number | null = null;
    // @Input() maxValNumber: number | null = null;

    protected classNameWarningIcon = '';
    // protected minVal: unknown;
    // protected maxVal: unknown;


    // private subscriptionMinValString$: Subscription = new Subscription();
    // private subscriptionMaxValString$: Subscription = new Subscription();

    constructor() {
        super();
        effect(() => {
            this.handleInputChanges(this.field().value());
        });
    }

    ngOnInit() {
        // this.subscriptionMinValString$ = this.minStringObservable.subscribe(val => {
        //     this.minVal = val ?? this.minValNumber;
        // })
        // this.subscriptionMaxValString$ = this.maxStringObservable.subscribe(val => {
        //     this.maxVal = val ?? this.maxValNumber;
        // })
        this.configWarningIconByInputType();
        // this.configMinMaxValues();
    }

    // configMinMaxValues() {
    //     if(this.inputType() === 'datetime-local' && this.minVal !== '' && this.minValString !== '') {
    //         this.minVal = this.minValString;
    //     } else if(this.inputType() === 'number') {
    //         this.minVal = this.minValNumber;
    //         this.maxVal = this.maxValNumber;
    //     }
    // }

    configWarningIconByInputType() {
        switch(this.inputType()) {
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
}