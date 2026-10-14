import { Component, Inject, OnInit, DOCUMENT, ChangeDetectionStrategy, inject } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import _ from 'underscore';
import { CommonModule } from "@angular/common";
import { DeviceOptions } from "../../../shared/enums/device-option.enum";
import { filter } from "rxjs";
import { AssetsPreloadService } from "../../../shared/services/assets-preload.service";
import { CustomRoute } from "../../../shared/interfaces/custom-route.interface";

@Component({
    selector: 'tava-navigation',
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class NavigationComponent implements OnInit {

    private readonly navigation = inject(NavigationService);

    protected deviceOptions = DeviceOptions;
    protected routes: CustomRoute[] = [];
    protected preloadImages: string[];
    protected isPreloading: boolean;
    protected deviceMode: DeviceOptions;

    private maxMobileWidth: number;
    private window: any;

    constructor(
        private readonly router: Router,
        @Inject(DOCUMENT) private document: Document,
        private readonly assetPreload: AssetsPreloadService,
    ) {
        this.window = this.document.defaultView;
        this.maxMobileWidth = 1024;
        this.isPreloading = true;
        this.deviceMode = DeviceOptions.MOBILE;

        this.preloadImages = [];

        this.router.events
        .pipe(filter(evt => evt instanceof NavigationEnd))
        .subscribe((event: any) => {
            this.navigation.setPreviousUrl(this.navigation.getCurrentUrl());
            this.navigation.setCurrentUrl(event.url);
        })
    }

    ngOnInit() {
        const navIcons = this.navigation.getNavigationIconPaths();
        this.preloadImages = [
            '/assets/logo_v2.webp',
            '/assets/app-icons/icon_warning.svg',
            ...navIcons
        ];
        this.assetPreload.preloadAssets({images: this.preloadImages}).finally(() => {
            this.isPreloading = false;
        });

        this.routes = this.navigation.getNavigationRoutes();

        if(this.window.screen !== undefined) {
            this.setNavWidthDynamically(this.window.screen.width);
            this.setNavWidthDynamically(this.document.body.clientWidth);        
        }

        // adapt to device screen resolution
        const screenWidthRequestSlowedDown = _.debounce( () => {
            this.setNavWidthDynamically(this.window.screen.width);
        }, 250)
        this.window.addEventListener("resize", screenWidthRequestSlowedDown, false);

        // adapt to zoom level
        const clientWidthRequestSlowedDown = _.debounce( () => {
            this.setNavWidthDynamically(this.document.body.clientWidth);
        }, 250)
        this.window.addEventListener("resize", clientWidthRequestSlowedDown, false);
    }

    private setNavWidthDynamically(width: number): void {
        // sets data attribute for body and in media.scss style settings are applied
        if(width > this.maxMobileWidth) {
            this.document.body.setAttribute("data-nav", 'desktopMode');
            this.deviceMode = DeviceOptions.STATIONARY;
        } else {
            this.document.body.setAttribute("data-nav", 'mobileMode');
            this.deviceMode = DeviceOptions.MOBILE;
        }
    }
}