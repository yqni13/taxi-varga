import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ThemeObservationService } from "../../shared/services/theme-observation.service";
import { Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../shared/enums/theme-options.enum";
import { CommonModule } from "@angular/common";
import { CarouselComponent } from "../../common/components/carousel/carousel.component";

@Component({
    selector: 'tava-about',
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss',
    standalone: true,
    imports: [
        CarouselComponent,
        CommonModule,
        TranslateModule,
    ]
})
export class AboutComponent implements OnInit, OnDestroy {

    protected selectedBg: string;
    protected images: string[];
    private subscriptionThemeObservation$: Subscription;

    constructor(
        private readonly translate: TranslateService,
        private readonly themeObservation: ThemeObservationService
    ) {
        this.images = [
            'assets/foto4.jpg',
            'assets/foto11.jpg',
            'assets/foto5.jpg',
            'assets/foto1.jpg',
            'assets/foto7.jpg'
        ];
        this.selectedBg = '';
        this.subscriptionThemeObservation$ = new Subscription();
    }

    ngOnInit() {
        this.subscriptionThemeObservation$ = this.themeObservation.themeOption$.pipe(
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