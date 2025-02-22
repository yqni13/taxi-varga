import { CommonModule, DOCUMENT } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ObservationService } from "../../shared/services/observation.service";
import { Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../shared/enums/theme-options.enum";
import * as content from "../../../../public/assets/i18n/privacy-en.json";

@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.component.html',
    styleUrl: './privacy.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class PrivacyComponent implements OnInit, OnDestroy {

    protected selectedBg: string;
    protected privacyData: string[];

    private subscriptionThemeObservation$: Subscription;

    constructor(
        private readonly translate: TranslateService,
        private readonly observation: ObservationService,
        @Inject(DOCUMENT) private readonly document: Document
    ) {
        this.selectedBg = '';
        this.privacyData = this.configContentLoop();
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

    private configContentLoop() {
        const usedNumberOfElements = Object.keys(content['z-content-privacy']['headers']);
        return usedNumberOfElements.filter(item => item !== 'complaint');
    }

    navigateToHeader(id: string) {
        this.document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
    
    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}