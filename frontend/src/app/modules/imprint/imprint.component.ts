/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ObservationService } from "../../shared/services/observation.service";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../shared/enums/theme-options.enum";
import { CommonModule } from "@angular/common";
import { BaseRoute } from "../../api/routes/base.route.enum";
import { AssetsPreloadService } from "../../shared/services/assets-preload.service";

@Component({
    selector: 'tava-imprint',
    templateUrl: './imprint.component.html',
    styleUrl: './imprint.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ]
})
export class ImprintComponent implements OnInit, OnDestroy {

    protected selectedBg: string;
    protected devData: any;
    protected ownerData: any;
    protected images: string[];
    protected isPreloading: boolean;

    private subscriptionThemeObservation$: Subscription;

    constructor(
        private readonly observation: ObservationService,
        private readonly preload: AssetsPreloadService
    ) {
        this.selectedBg = '';
        this.subscriptionThemeObservation$ = new Subscription();
        
        this.devData = {
            project: 'taxi-varga',
            version: 'v1.9.25',
            github: 'https://github.com/yqni13/taxi-varga/tree/production',
            portfolio: 'https://yqni13.com',
            contact: BaseRoute.SUPPORT
        };

        this.ownerData = {
            name: 'Ing. Laszlo Varga',
            address: 'Anton Bruckner-Gasse 11\n2544 Leobersdorf, Österreich',
            uid: 'ATU60067019',
            email: 'laszlovarga@gmx.at',
            phone: '+436644465466',
        };
        this.images = [];
        this.isPreloading = true;
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
        this.images = ['assets/docs/icons/yqni13-small.png'];
        this.preload.preloadAssets({images: this.images}).finally(() => {
            this.isPreloading = false;
        })
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}