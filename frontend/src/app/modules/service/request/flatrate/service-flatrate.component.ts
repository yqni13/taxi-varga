import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../../../shared/enums/theme-options.enum";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ObservationService } from "../../../../shared/services/observation.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'tava-service-flatrate',
    templateUrl: './service-flatrate.component.html',
    styleUrl: './service-flatrate.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class ServiceFlatrateComponent implements OnInit, OnDestroy {

    protected selectedBg: string;
    protected hasOffer: boolean;
    protected hasOrder: boolean;
    protected hasConfirmed: boolean;

    private subscriptionThemeObservation$: Subscription;

    constructor(
        private readonly translate: TranslateService,
        private readonly observation: ObservationService
    ) {
        this.selectedBg = '';
        this.hasOffer = false;
        this.hasOrder = false;
        this.hasConfirmed = false;
    
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

    nextOffer() {
        console.log('continue with offer');
        this.hasOffer = true;
    }

    nextOrder() {
        console.log('continue with order');
        this.hasOrder = true;
    }

    nextConfirm() {
        console.log('offer confirmed');
        this.hasConfirmed = true;
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}