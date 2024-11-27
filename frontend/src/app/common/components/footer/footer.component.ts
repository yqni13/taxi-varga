/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule, DOCUMENT } from "@angular/common";
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { LanguageOptions } from "../../../shared/enums/language-options.enum";
import { ThemeHandlerService } from "../../../shared/services/theme-handler.service";
import { ThemeOptions } from "../../../shared/enums/theme-options.enum";

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

    @ViewChild('themeMode') themeMode?: ElementRef; 
    @ViewChild('themeIcon') themeIcon?: ElementRef; 

    protected selectedLanguage: LanguageOptions;
    protected showLanguageList: boolean;
    protected creatorURL: string;
    protected routes: Route[];
    protected selectedTheme: ThemeOptions;
    protected themes = ThemeOptions;

    constructor(
        private readonly themeHandler: ThemeHandlerService,
        private readonly translate: TranslateService,
        private navigation: NavigationService,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.selectedTheme = this.themeHandler.checkThemeSettings();
        this.themeHandler.setThemeSettings(this.selectedTheme);

        this.selectedLanguage = LanguageOptions.en;
        this.showLanguageList = false;
        this.creatorURL = 'https://yqni13.com';
        this.routes = [];
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
}