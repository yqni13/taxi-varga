import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { CastAbstract2FormControlPipe } from "../../../pipes/cast-abstract2form-control.pipe";
import { TextareaInputComponent } from "../textarea-input/textarea-input.component";
import { TextInputComponent } from "../text-input/text-input.component";
import { SelectInputComponent } from "../select-input/select-input.component";
import { MetaFormRequest } from "../../../../shared/interfaces/meta-request.interface";

@Component({
    selector: 'tava-servicemeta',
    templateUrl: './service-meta.component.html',
    styleUrl: './service-meta.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        CastAbstract2FormControlPipe,
        ReactiveFormsModule,
        TranslateModule,
        TextareaInputComponent,
        TextInputComponent,
        SelectInputComponent
    ]
})
export class ServiceMetaComponent {
    
    @Input() metaFormGroup!: FormGroup<MetaFormRequest>;

    constructor() {
        //
    }
}