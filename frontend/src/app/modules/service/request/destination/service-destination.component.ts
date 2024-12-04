import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../../../shared/enums/theme-options.enum";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ObservationService } from "../../../../shared/services/observation.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'tava-service-destination',
    templateUrl: './service-destination.component.html',
    styleUrl: './service-destination.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class ServiceDestinationComponent implements OnInit, OnDestroy {

    protected selectedBg: string;

    private subscriptionThemeObservation$: Subscription;

    constructor(
        private readonly translate: TranslateService,
        private readonly observation: ObservationService
    ) {
        this.selectedBg = '';
    
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