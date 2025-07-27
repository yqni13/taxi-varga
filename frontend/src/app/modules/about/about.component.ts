import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ObservationService } from "../../shared/services/observation.service";
import { Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../shared/enums/theme-options.enum";
import { CommonModule } from "@angular/common";
import { CarouselComponent } from "../../common/components/carousel/carousel.component";
import { AssetsPreloadService } from "../../shared/services/assets-preload.service";

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
    protected isPreloading: boolean;

    private subscriptionObservation$: Subscription;

    constructor(
        private readonly observation: ObservationService,
        private readonly assetsPreloadService: AssetsPreloadService
    ) {
        this.selectedBg = '';
        this.images = [];
        this.isPreloading = true;

        this.subscriptionObservation$ = new Subscription();
    }

    ngOnInit() {
        this.images = [
            'assets/foto4.jpg',
            'assets/foto3.jpg',
            'assets/foto11.jpg',
            'assets/foto8.jpg',
            'assets/foto5.jpg',
            'assets/foto1.jpg',
            'assets/foto7.jpg',
            'assets/foto12.jpg',
            'assets/foto14.jpg'
        ];
        this.assetsPreloadService.preloadAssets({images: this.images}).finally(() => {
            this.isPreloading = false;
        });
        
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