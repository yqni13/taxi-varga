import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { LanguageOptions } from "../../../shared/enums/language-options.enum";
import { ThemeHandlerService } from "../../../shared/services/theme-handler.service";
import { ThemeOptions } from "../../../shared/enums/theme-options.enum";
import { LanguageHandlerService } from "../../../shared/services/language-handler.service";
import { CustomRoute } from "../../../shared/interfaces/custom-route.interface";

@Component({
    selector: 'tava-footer',
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        '(window:click)': 'clickOutside($event)'
    }
})
export class FooterComponent implements OnInit, AfterViewInit {

    private readonly navigation = inject(NavigationService);

    @ViewChild('themeMode') themeMode?: ElementRef; 
    @ViewChild('themeIcon') themeIcon?: ElementRef; 

    protected languages = LanguageOptions;
    protected selectedLanguage: LanguageOptions;
    protected showLanguageWindow: boolean;
    protected creatorURL: string;
    protected routes: CustomRoute[] = [];
    protected selectedTheme: ThemeOptions;
    protected themes = ThemeOptions;
    protected currentYear: string;

    constructor(
        private readonly themeHandler: ThemeHandlerService,
        private readonly languageHandler: LanguageHandlerService,
    ) {
        this.selectedTheme = this.themeHandler.checkThemeSettings();
        this.themeHandler.setThemeSettings(this.selectedTheme);

        this.selectedLanguage = this.languageHandler.checkLanguageData();
        this.languageHandler.setLanguageData(this.selectedLanguage);

        this.showLanguageWindow = false;
        this.creatorURL = 'https://yqni13.com';
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

    clickOutside($event: any) {
        if(!$event.target.className.includes('tava-language-element')) {
            this.showLanguageWindow = false;
        }
    }
}