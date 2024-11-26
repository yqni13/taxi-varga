import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ThemeObservationService } from "../../shared/services/theme-observation.service";
import { Subscription, tap } from "rxjs";
import { ThemeOption } from "../../shared/enums/theme-options.enum";

@Component({
    selector: 'tava-service',
    templateUrl: './service.component.html',
    styleUrl: './service.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class ServiceComponent implements OnInit, OnDestroy {

    protected selectedBg: string;

    private subscriptionThemeObservation$: Subscription;

    constructor(
        private readonly translate: TranslateService,
        private readonly themeObservation: ThemeObservationService
    ) {
        this.selectedBg = '';

        this.subscriptionThemeObservation$ = new Subscription();
    }

    ngOnInit() {
        this.subscriptionThemeObservation$ = this.themeObservation.themeOption$.pipe(
            tap((theme: ThemeOption) => {
                switch(theme) {
                    case(ThemeOption.lightMode): {
                        this.selectedBg = 'bg-pattern-light';
                        break;
                    }
                    case(ThemeOption.darkMode):
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