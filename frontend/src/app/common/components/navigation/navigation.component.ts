/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { Route, RouterModule } from "@angular/router";
import _ from 'underscore';
import { CommonModule, DOCUMENT } from "@angular/common";
import { ThemeOptions } from "../../../shared/enums/theme-options.enum";
import { ThemeObservationService } from "../../../shared/services/theme-observation.service";

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
export class NavigationComponent implements OnInit, AfterViewInit {

    @ViewChild("themeModeIcon") themeModeIcon!: ElementRef;

    protected routes: Route[];
    protected selectedTheme: ThemeOptions;
    protected isMobileMode: boolean;

    private maxMobileWidth: number;
    private window: any;
    private isLocalStorageAvailable: any;

    constructor(
        private readonly navigation: NavigationService,
        @Inject(DOCUMENT) private document: Document,
        private readonly translate: TranslateService,
        private readonly themeObservation: ThemeObservationService
    ) {
        this.isLocalStorageAvailable = typeof localStorage !== 'undefined';
        this.selectedTheme = this.checkThemeSettings();
        this.setThemeSettings(this.selectedTheme);
        this.translate.use('en');

        this.window = this.document.defaultView;
        this.maxMobileWidth = 1024;
        this.routes = [];
        this.isMobileMode = false;
    }

    ngOnInit() {
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

    ngAfterViewInit() {
        this.applyThemeStyling();
    }

    private setNavWidthDynamically(width: number): void {
        // sets data attribute for body and in media.scss style settings are applied
        if(width > this.maxMobileWidth) {
            this.document.body.setAttribute("data-nav", 'desktopMode');
            this.isMobileMode = false;
        } else {
            this.document.body.setAttribute("data-nav", 'mobileMode');
            this.isMobileMode = true;
        }
    }

    private checkThemeSettings(): ThemeOptions {
        if(this.isLocalStorageAvailable) {
            const theme = localStorage.getItem('taxi-varga.at-theme');
            if(!theme) {
                return ThemeOptions.darkMode;
            }

            return String(theme) === 'lightMode' ? ThemeOptions.lightMode : ThemeOptions.darkMode;
        }

        return ThemeOptions.darkMode;
    }

    private setThemeSettings(theme: ThemeOptions) {
        if(this.isLocalStorageAvailable) {
            if(theme) {
                localStorage.setItem("taxi-varga.at-theme", theme);
                this.document.body.setAttribute("data-theme", theme);
                this.themeObservation.setThemeOption(theme);
                return;
            }
        }
        
        this.themeObservation.setThemeOption(ThemeOptions.darkMode);
        this.document.body.setAttribute("data-theme", 'darkMode');
    }

    protected switchTheme() {
        if(this.isLocalStorageAvailable) {
            if (this.selectedTheme === ThemeOptions.darkMode) {
                this.selectedTheme = ThemeOptions.lightMode;
            } else {
                this.selectedTheme = ThemeOptions.darkMode
            }

            this.setThemeSettings(this.selectedTheme);
            return;
        }

        this.selectedTheme = ThemeOptions.darkMode;
        this.setThemeSettings(this.selectedTheme);
    }

    private applyThemeStyling() {
        if(this.themeModeIcon) {
            this.themeModeIcon.nativeElement.classList.remove(ThemeOptions.darkMode, ThemeOptions.lightMode);
            this.themeModeIcon.nativeElement.classList.add(this.selectedTheme);
        }
    }
}