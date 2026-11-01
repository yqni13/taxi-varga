import { ServiceRoute } from '../../api/routes/service.route.enum';
import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ObservationService } from "../../shared/services/observation.service";
import { Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../shared/enums/theme-options.enum";
import { RouterModule } from "@angular/router";
import { NavigationService } from '../../shared/services/navigation.service';
import { BaseRoute } from '../../api/routes/base.route.enum';

@Component({
    selector: 'tava-service',
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ],
    templateUrl: './service.component.html',
    styleUrl: './service.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class ServiceComponent implements OnInit, OnDestroy {

    private readonly navigation = inject(NavigationService);
    private readonly observation = inject(ObservationService);

    protected selectedBg = '';
    protected authorAirportImg = 'https://pixabay.com/de/users/pexels-2286921/';
    protected authorFlatrateImg = 'https://pixabay.com/de/users/geralt-9301/';
    protected authorGolfImg = 'https://pixabay.com/de/users/zhaofugang1234-5835675/';
    protected authorQuickImg = 'https://pixabay.com/de/photos/der-verkehr-thailand-stadt-stra%C3%9Fe-7025825/';
    protected ServiceRouteEnum = ServiceRoute;

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

    overridePreviousUrl() {
        this.navigation.setPreviousUrl(`/${BaseRoute.SERVICE}`);
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}
