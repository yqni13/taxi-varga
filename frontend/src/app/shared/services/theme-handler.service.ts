/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from "@angular/core";
import { ThemeOptions } from "../enums/theme-options.enum";
import { DOCUMENT } from "@angular/common";
import { ObservationService } from "./observation.service";

@Injectable({
    providedIn: 'root',
})
export class ThemeHandlerService {

    private isLocalStorageAvailable: any;
    
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private readonly observation: ObservationService,
    ) {
        this.isLocalStorageAvailable = typeof localStorage !== 'undefined';
    }

    checkThemeSettings(): ThemeOptions {
        if(this.isLocalStorageAvailable) {
            const theme = localStorage.getItem('taxi-varga.at-theme');
            if(!theme) {
                return ThemeOptions.darkMode;
            }

            return String(theme) === 'lightMode' ? ThemeOptions.lightMode : ThemeOptions.darkMode;
        }

        return ThemeOptions.darkMode;
    }

    setThemeSettings(theme: ThemeOptions) {
        if(this.isLocalStorageAvailable) {
            if(theme) {
                localStorage.setItem("taxi-varga.at-theme", theme);
                this.document.body.setAttribute("data-theme", theme);
                this.observation.setThemeOption(theme);
                return;
            }
        }
        
        this.observation.setThemeOption(ThemeOptions.darkMode);
        this.document.body.setAttribute("data-theme", 'darkMode');
    }

    switchTheme(theme: ThemeOptions): ThemeOptions {
        if(this.isLocalStorageAvailable) {
            if (theme === ThemeOptions.darkMode) {
                theme = ThemeOptions.lightMode;
            } else {
                theme = ThemeOptions.darkMode
            }

            this.setThemeSettings(theme);
            return theme;
        }

        this.setThemeSettings(ThemeOptions.darkMode);
        return ThemeOptions.darkMode;
    }
}