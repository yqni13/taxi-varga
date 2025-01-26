/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ObservationService } from "../../shared/services/observation.service";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subject, Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../shared/enums/theme-options.enum";
import { CommonModule } from "@angular/common";

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
    protected selectedLanguage$: Subject<string>;
    protected devData: any;
    protected ownerData: any;

    private subscriptionThemeObservation$: Subscription;

    constructor(
        private readonly translate: TranslateService,
        private readonly observation: ObservationService
    ) {
        this.selectedBg = '';
        this.selectedLanguage$ = new Subject<string>();
        this.subscriptionThemeObservation$ = new Subscription();
        
        this.devData = {
            project: 'taxi-varga',
            version: 'v1.0.0-beta.2',
            github: 'https://github.com/yqni13/taxi-varga',
            portfolio: 'https://yqni13.com',
            email: 'lukas.varga@yqni13.com'
        };

        this.ownerData = {
            name: 'Ing. Laszlo Varga',
            address: 'Anton Bruckner-Gasse 11\n2544 Leobersdorf, Österreich',
            uid: 'ATU60067019',
            email: 'laszlovarga@gmx.at',
            phone: '+436644465466',
        };
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

        this.translate.onLangChange.subscribe(val => {
            this.selectedLanguage$.next(val.lang);
        })
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}