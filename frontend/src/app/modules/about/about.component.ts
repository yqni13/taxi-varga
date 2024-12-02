import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ObservationService } from "../../shared/services/observation.service";
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
    private subscriptionObservation$: Subscription;

    constructor(
        private readonly translate: TranslateService,
        private readonly observation: ObservationService
    ) {
        this.images = [
            'assets/foto4.jpg',
            'assets/foto3.jpg',
            'assets/foto11.jpg',
            'assets/foto8.jpg',
            'assets/foto5.jpg',
            'assets/foto1.jpg',
            'assets/foto7.jpg'
        ];
        this.selectedBg = '';
        this.subscriptionObservation$ = new Subscription();
    }

    ngOnInit() {
        this.subscriptionObservation$ = this.observation.themeOption$.pipe(
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
        this.subscriptionObservation$.unsubscribe();
    }
}