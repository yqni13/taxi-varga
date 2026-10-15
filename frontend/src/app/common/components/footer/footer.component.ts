import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnInit, ChangeDetectionStrategy, inject, viewChild } from "@angular/core";
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
    private readonly themeHandler = inject(ThemeHandlerService);
    private readonly languageHandler = inject(LanguageHandlerService);

    private readonly themeMode = viewChild<ElementRef>('themeMode');
    private readonly themeIcon = viewChild<ElementRef>('themeIcon');

    protected themes = ThemeOptions;
    protected languages = LanguageOptions;
    protected showLanguageWindow = false;
    protected creatorURL = 'https://yqni13.com';
    protected routes: CustomRoute[] = [];
    protected currentYear = new Date().getFullYear().toString();
    protected selectedLanguage: LanguageOptions = this.languageHandler.checkLanguageData();
    protected selectedTheme: ThemeOptions = this.themeHandler.checkThemeSettings();

    ngOnInit() {
        this.routes = this.navigation.getFootertRoutes();
        this.themeHandler.setThemeSettings(this.selectedTheme);
        this.languageHandler.setLanguageData(this.selectedLanguage);
    }

    protected setTheme() {
        this.selectedTheme = this.themeHandler.switchTheme(this.selectedTheme);
    }

    ngAfterViewInit() {
        // Prevent overwriting theme and icon in class properties with both values.
        this.applyThemeClass();
    }

    private applyThemeClass() {
        if(this.themeMode) {
            this.themeMode()?.nativeElement.classList.remove(ThemeOptions.darkMode, ThemeOptions.lightMode);
            this.themeMode()?.nativeElement.classList.add(this.selectedTheme);
        } 
        if(this.themeIcon) {
            this.themeIcon()?.nativeElement.classList.remove('icon-lightMode', 'icon-darkMode');
            this.themeIcon()?.nativeElement.classList.add(`icon-${this.selectedTheme}`);
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