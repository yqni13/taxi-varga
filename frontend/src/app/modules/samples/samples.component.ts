import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, inject } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ObservationService } from "../../shared/services/observation.service";
import { Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../shared/enums/theme-options.enum";
import { RouterModule } from "@angular/router";
import * as content from "../../../../public/assets/i18n/samples-en.json";
import { VarDirective } from "../../common/directives/ng-var.directive";

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
    protected samplesOption4Entries = Object.entries(content["z-content-samples"]["samples-content-option4"]);

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

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}
