import { AddressInputComponent } from "../components/form-components/address-input/address-input.component";
import { CastAbstract2FormControlPipe } from "../pipes/cast-abstract2form-control.pipe";
import { CommonModule } from "@angular/common";
import { CurrencyFormatPipe } from "../pipes/currency-format.pipe";
import { ReactiveFormsModule } from "@angular/forms";
import { SelectInputComponent } from "../components/form-components/select-input/select-input.component";
import { TextareaInputComponent } from "../components/form-components/textarea-input/textarea-input.component";
import { TextInputComponent } from "../components/form-components/text-input/text-input.component";
import { TranslateModule } from "@ngx-translate/core";
import { VarDirective } from "../directives/ng-var.directive";

export const ServiceImportsHelperModule = [
    AddressInputComponent,
    CastAbstract2FormControlPipe,
    CommonModule,
    CurrencyFormatPipe,
    ReactiveFormsModule,
    SelectInputComponent,
    TextareaInputComponent,
    TextInputComponent,
    TranslateModule,
    VarDirective,
]