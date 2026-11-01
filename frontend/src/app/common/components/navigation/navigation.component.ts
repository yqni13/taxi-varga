import { Component, OnInit, ChangeDetectionStrategy, inject } from "@angular/core";
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

    private readonly router = inject(Router);
    private readonly navigation = inject(NavigationService);
    private readonly assetPreload = inject(AssetsPreloadService);

    protected deviceOptions = DeviceOptions;
    protected routes: CustomRoute[] = [];
    protected preloadImages: string[] = [];
    protected isPreloading = true;
    protected deviceMode: DeviceOptions = DeviceOptions.MOBILE;

    private maxMobileWidth = 1024;
    private window = document.defaultView;

    ngOnInit() {
        this.router.events.pipe(
            filter(evt => evt instanceof NavigationEnd))
            .subscribe((event: any) => {
                this.navigation.setPreviousUrl(this.navigation.getCurrentUrl());
                this.navigation.setCurrentUrl(event.url);
            }
        );

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

        if(this.window!.screen !== undefined) {
            this.setNavWidthDynamically(this.window!.screen.width);
            this.setNavWidthDynamically(document.body.clientWidth);
        }

        // adapt to device screen resolution
        const screenWidthRequestSlowedDown = _.debounce( () => {
            this.setNavWidthDynamically(this.window!.screen.width);
        }, 250)
        this.window!.addEventListener("resize", screenWidthRequestSlowedDown, false);

        // adapt to zoom level
        const clientWidthRequestSlowedDown = _.debounce( () => {
            this.setNavWidthDynamically(document.body.clientWidth);
        }, 250)
        this.window!.addEventListener("resize", clientWidthRequestSlowedDown, false);
    }

    private setNavWidthDynamically(width: number): void {
        // sets data attribute for body and in media.scss style settings are applied
        if(width > this.maxMobileWidth) {
            document.body.setAttribute("data-nav", 'desktopMode');
            this.deviceMode = DeviceOptions.STATIONARY;
        } else {
            document.body.setAttribute("data-nav", 'mobileMode');
            this.deviceMode = DeviceOptions.MOBILE;
        }
    }
}