import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, inject } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ObservationService } from "../../shared/services/observation.service";
import { Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../shared/enums/theme-options.enum";
import * as content from "../../../../public/assets/i18n/privacy-en.json";

@Component({
    selector: 'app-privacy',
    imports: [
        CommonModule,
        TranslateModule
    ],
    templateUrl: './privacy.component.html',
    styleUrl: './privacy.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class PrivacyComponent implements OnInit, OnDestroy {

    private readonly observation = inject(ObservationService);

    protected selectedBg = '';
    protected privacyData: string[] = this.configContentLoop();

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

    private configContentLoop() {
        const usedNumberOfElements = Object.keys(content['z-content-privacy']['headers']);
        return usedNumberOfElements.filter(item => item !== 'complaint');
    }

    navigateToHeader(id: string) {
        document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
    
    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}