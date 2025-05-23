import { ServiceOptions } from './../../shared/enums/service-options.enum';
import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ObservationService } from "../../shared/services/observation.service";
import { Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../shared/enums/theme-options.enum";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'tava-service',
    templateUrl: './service.component.html',
    styleUrl: './service.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ]
})
export class ServiceComponent implements OnInit, OnDestroy {

    protected selectedBg: string;
    protected authorAirportImg: string;
    protected authorFlatrateImg: string;
    protected authorGolfImg: string;
    protected ServiceRouteEnum = ServiceOptions;

    private subscriptionThemeObservation$: Subscription;

    constructor(
        private readonly observation: ObservationService
    ) {
        this.selectedBg = '';
        this.authorAirportImg = 'https://pixabay.com/de/users/pexels-2286921/';
        this.authorFlatrateImg = 'https://pixabay.com/de/users/geralt-9301/';
        this.authorGolfImg = 'https://pixabay.com/de/users/zhaofugang1234-5835675/';
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
