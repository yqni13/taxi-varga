import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { VarDirective } from "../../../directives/ng-var.directive";

@Component({
    selector: 'tava-validation',
    templateUrl: './validation-input.component.html',
    styleUrl: './validation-input.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        VarDirective
    ]
})
export class ValidationInputComponent {

    @Input() ngControl: FormControl;
    @Input() fieldName: string;

    constructor(private translate: TranslateService) { 
        this.ngControl = new FormControl();
        this.fieldName = '';
    }
}