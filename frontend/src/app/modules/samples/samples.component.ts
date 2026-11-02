/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, inject } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ObservationService } from "../../shared/services/observation.service";
import { Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../shared/enums/theme-options.enum";
import { RouterModule } from "@angular/router";
import * as content from "../../../../public/assets/i18n/samples-en.json";
import { VarDirective } from "../../common/directives/ng-var.directive";
import { SamplesGolfContent } from "../../shared/interfaces/samples.interface";

@Component({
    selector: 'tava-samples',
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        VarDirective
    ],
    templateUrl: './samples.component.html',
    styleUrl: './samples.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class SamplesComponent implements OnInit, OnDestroy {

    private readonly observation = inject(ObservationService);

    protected selectedBg = '';
    protected samplesOption1Length = Object.keys(content["z-content-samples"]["samples-content-option1"]).length;
    protected samplesOption2Length = Object.keys(content["z-content-samples"]["samples-content-option2"]).length;
    protected samplesOption3Length = Object.keys(content["z-content-samples"]["samples-content-option3"]).length;
    protected samplesGolf: SamplesGolfContent[] = this.getGolfSamples();

    private subscriptionThemeObservation$: Subscription = new Subscription();

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

    getGolfSamples(): SamplesGolfContent[] {
        return [
            { title: 'single', length: Object.keys(content["z-content-samples"]["samples-content-option4"]["single"]).length },
            { title: 'multi2', length: Object.keys(content["z-content-samples"]["samples-content-option4"]["multi2"]).length },
            { title: 'multi3', length: Object.keys(content["z-content-samples"]["samples-content-option4"]["multi3"]).length },
            { title: 'multi4', length: Object.keys(content["z-content-samples"]["samples-content-option4"]["multi4"]).length },
        ];
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}
