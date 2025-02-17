/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { LanguageOptions } from "../../../shared/enums/language-options.enum";
import { ThemeHandlerService } from "../../../shared/services/theme-handler.service";
import { ThemeOptions } from "../../../shared/enums/theme-options.enum";
import { LanguageHandlerService } from "../../../shared/services/language-handler.service";

@Component({
    selector: 'tava-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ]
})
export class FooterComponent implements OnInit, AfterViewInit {

    @HostListener('window:click', ['$event'])
    clickOutside($event: any) {
        if(!$event.target.className.includes('tava-language-element')) {
            this.showLanguageWindow = false;
        }
    }

    @ViewChild('themeMode') themeMode?: ElementRef; 
    @ViewChild('themeIcon') themeIcon?: ElementRef; 

    protected languages = LanguageOptions;
    protected selectedLanguage: LanguageOptions;
    protected showLanguageWindow: boolean;
    protected creatorURL: string;
    protected routes: Route[];
    protected selectedTheme: ThemeOptions;
    protected themes = ThemeOptions;
    protected currentYear: string;

    constructor(
        private readonly themeHandler: ThemeHandlerService,
        private readonly languageHandler: LanguageHandlerService,
        private readonly translate: TranslateService,
        private navigation: NavigationService
    ) {
        this.selectedTheme = this.themeHandler.checkThemeSettings();
        this.themeHandler.setThemeSettings(this.selectedTheme);

        this.selectedLanguage = this.languageHandler.checkLanguageData();
        this.languageHandler.setLanguageData(this.selectedLanguage);

        this.showLanguageWindow = false;
        this.creatorURL = 'https://yqni13.com';
        this.routes = [];
        this.currentYear = new Date().getFullYear().toString();
    }

    protected setTheme() {
        this.selectedTheme = this.themeHandler.switchTheme(this.selectedTheme);
    }

    ngOnInit() {
        this.routes = this.navigation.getFootertRoutes();
    }

    ngAfterViewInit() {
        // Prevent overwriting theme and icon in class properties with both values.
        this.applyThemeClass();
    }

    private applyThemeClass() {
        if(this.themeMode) {
            this.themeMode.nativeElement.classList.remove(ThemeOptions.darkMode, ThemeOptions.lightMode);
            this.themeMode.nativeElement.classList.add(this.selectedTheme);
        } 
        if(this.themeIcon) {
            this.themeIcon.nativeElement.classList.remove('icon-lightMode', 'icon-darkMode');
            this.themeIcon.nativeElement.classList.add(`icon-${this.selectedTheme}`);
        }
    }

    protected openLanguageWindow() {
        this.showLanguageWindow = true;
    }

    protected setLanguage(language: LanguageOptions) {
        this.languageHandler.setLanguageData(language);
        this.selectedLanguage = language;
        this.showLanguageWindow = false;
    }
}