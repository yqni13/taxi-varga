import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../shared/enums/theme-options.enum";
import { ObservationService } from "../../shared/services/observation.service";
import { Router } from "@angular/router";
import { BaseRoute } from "../../api/routes/base.route.enum";
import { ServiceOptions } from "../../shared/enums/service-options.enum";
import { default as homeLang } from "../../../../public/assets/i18n/home-en.json";
import { AssetsPreloadService } from "../../shared/services/assets-preload.service";

@Component({
    selector: 'tava-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class HomeComponent implements OnInit, OnDestroy {

    protected selectedBg: string;
    protected authors: any;
    protected serviceCollection: any[];
    protected serviceCollLength: number;
    protected serviceImgCollection: string[];
    protected homeImgCollection: string[];
    protected activeBg: any;
    protected isPreloading: boolean;

    private subscriptionThemeObservation$: Subscription;

    constructor(
        private readonly router: Router,
        private readonly observation: ObservationService,
        private readonly assetPreload: AssetsPreloadService
    ) {
        this.selectedBg = '';
        this.authors = {};
        this.serviceCollection = [];
        this.serviceCollLength = Object.values(homeLang['home']['services']['content']).length;
        this.serviceImgCollection = [];
        this.homeImgCollection = [];
        this.activeBg = {};
        this.isPreloading = true;

        this.subscriptionThemeObservation$ = new Subscription();
    }

    ngOnInit() {
        this.mapAuthorData();
        this.mapHomeImgData();
        this.mapServiceImgData();
        this.mapServiceData();
        const images = [
            ...this.serviceImgCollection, 
            ...this.homeImgCollection
        ];
        this.assetPreload.preloadAssets({images: images}).finally(() => {
            this.isPreloading = false;
        });
        this.subscriptionThemeObservation$ = this.observation.themeOption$.pipe(
            tap((theme: ThemeOptions) => {
                switch(theme) {
                    case(ThemeOptions.lightMode): {
                        this.selectedBg = 'bg-pattern-light';
                        this.activeBg = {
                            main: this.homeImgCollection[1],
                            sub: this.homeImgCollection[3]
                        };
                        break;
                    }
                    case(ThemeOptions.darkMode): 
                    default: {
                        this.selectedBg = 'bg-pattern-dark';
                        this.activeBg = {
                            main: this.homeImgCollection[0],
                            sub: this.homeImgCollection[2]
                        };
                        break;
                    }
                }
            })
        ).subscribe();
    }

    private mapAuthorData() {
        this.authors = {
            serviceAirport: 'https://pixabay.com/de/users/pexels-2286921/',
            serviceDestination: '',
            serviceGolf: 'https://pixabay.com/de/users/zhaofugang1234-5835675/',
            serviceFlatrate: 'https://pixabay.com/de/users/geralt-9301/',
            serviceQuick: 'https://pixabay.com/de/photos/taxi-taxis-flughafen-transport-7855475/'
        };
    }

    private mapServiceImgData() {
        this.serviceImgCollection = [
            '/assets/service/service-airport.webp',
            '/assets/service/service-destination.webp',
            '/assets/service/service-golf.webp',
            '/assets/service/service-flatrate.webp',
            '/assets/service/service-quick.webp',
        ];
    }

    private mapHomeImgData() {
        this.homeImgCollection = [
            'assets/home/home-main-dark.webp',
            'assets/home/home-main-light.webp',
            'assets/home/home-sub-dark.webp',
            'assets/home/home-sub-light.webp',
        ];
    }

    private mapServiceData() {
        let newEntry = {};
        const services = Object.values(ServiceOptions);
        const authors = Object.values(this.authors);
        for(let i = 0; i < this.serviceCollLength; i++) {
            newEntry = {
                title: `home.services.content.entry${i}.title`,
                subtitle: `home.services.content.entry${i}.subtitle`,
                text: `home.services.content.entry${i}.text`,
                imgPath: this.serviceImgCollection[i],
                service: services[i],
                authorPath: authors[i+4]
            }
            this.serviceCollection.push(newEntry);
        }
    }

    navigateToProfile() {
        this.router.navigate([`/${BaseRoute.ABOUT}`]);
    }
    
    navigateToService(service: string) {
        this.router.navigate([`/${BaseRoute.SERVICE}/${service}`]);
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}