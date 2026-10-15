import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { VarDirective } from "../../../directives/ng-var.directive";

@Component({
    selector: 'tava-validation',
    imports: [
        TranslateModule,
        VarDirective
    ],
    templateUrl: './validation-input.component.html',
    styleUrl: './validation-input.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class ValidationInputComponent {

    @Input() ngControl: FormControl;
    @Input() fieldName: string;

    constructor() { 
        this.ngControl = new FormControl();
        this.fieldName = '';
    }
}