import { Component } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'tava-about',
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss',
    standalone: true,
    imports: [
        TranslateModule
    ]
})
export class AboutComponent {

    constructor(private translate: TranslateService) {
        //
    }
}