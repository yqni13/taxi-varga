import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ObservationService } from "../../shared/services/observation.service";
import { Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../shared/enums/theme-options.enum";
import { RouterModule } from "@angular/router";
import * as content from "../../../../public/assets/i18n/samples-en.json";

@Component({
    selector: 'tava-samples',
    templateUrl: './samples.component.html',
    styleUrl: './samples.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ]
})
export class SamplesComponent implements OnInit, OnDestroy {

    protected selectedBg: string;
    protected samplesOption1Length: number;
    protected samplesOption2Length: number;
    protected samplesOption3Length: number;
    protected samplesOption4Length: number;

    private subscriptionThemeObservation$: Subscription;

    constructor(
        private readonly translate: TranslateService,
        private readonly observation: ObservationService
    ) {
        this.selectedBg = '';
        this.samplesOption1Length = Object.keys(content["z-content-samples"]["samples-content-option1"]).length;
        this.samplesOption2Length = Object.keys(content["z-content-samples"]["samples-content-option2"]).length;
        this.samplesOption3Length = Object.keys(content["z-content-samples"]["samples-content-option3"]).length;
        this.samplesOption4Length = Object.keys(content["z-content-samples"]["samples-content-option4"]).length;

        this.subscriptionThemeObservation$ = new Subscription();
    }

    ngOnInit() {
        this.subscriptionThemeObservation$ = this.observation.themeOption$.pipe(
            tap((theme: ThemeOptions) => {
                switch(theme) {
                    case(ThemeOptions.lightMode): {
                        this.selectedBg = 'bg-pattern-light';
                        break;
                    }
                    case(ThemeOptions.darkMode):
                    default: {
                        this.selectedBg = 'bg-pattern-dark';
                    }
                }
            })
        ).subscribe();
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}
