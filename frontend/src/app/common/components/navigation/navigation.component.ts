/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { NavigationEnd, Route, Router, RouterModule } from "@angular/router";
import _ from 'underscore';
import { CommonModule, DOCUMENT } from "@angular/common";
import { DeviceOptions } from "../../../shared/enums/device-option.enum";
import { filter } from "rxjs";
import { AssetsPreloadService } from "../../../shared/services/assets-preload.service";

@Component({
    selector: 'tava-navigation',
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ]
})
export class NavigationComponent implements OnInit {

    protected deviceOptions = DeviceOptions;
    protected routes: Route[];
    
    protected deviceMode: DeviceOptions;

    private maxMobileWidth: number;
    private window: any;
    private isLocalStorageAvailable: any;

    constructor(
        private readonly router: Router,
        private readonly navigation: NavigationService,
        @Inject(DOCUMENT) private document: Document,
        private readonly assetPreload: AssetsPreloadService
        
    ) {
        this.isLocalStorageAvailable = typeof localStorage !== 'undefined';

        this.window = this.document.defaultView;
        this.maxMobileWidth = 1024;
        this.routes = [];
        this.deviceMode = DeviceOptions.MOBILE;

        this.router.events
        .pipe(filter(evt => evt instanceof NavigationEnd))
        .subscribe((event: any) => {
            this.navigation.setPreviousUrl(this.navigation.getCurrentUrl());
            this.navigation.setCurrentUrl(event.url);
        })
    }

    ngOnInit() {
        this.assetPreload.preloadAssets({images: ['assets/logo.webp']});

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