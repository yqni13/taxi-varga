/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from "@angular/core";
import { LanguageOptions } from "../enums/language-options.enum";
import { DOCUMENT } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})

export class LanguageHandlerService {

    private isLocalStorageAvailable: any;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private readonly translate: TranslateService
    ) {
        this.isLocalStorageAvailable = typeof localStorage !== 'undefined';
    }

    checkLanguageData(): LanguageOptions {
        if(this.isLocalStorageAvailable) {
            const language = localStorage.getItem('taxi-varga.at-language');

            if(!language) {
                return LanguageOptions.de;
            }

            switch(String(language)) {
                case('en'):
                return LanguageOptions.en;
                case('de'):
                default:
                    return LanguageOptions.de;
            }
        }
        
        return LanguageOptions.de;
    }

    setLanguageData(language: LanguageOptions) {
        if(this.isLocalStorageAvailable) {
            if(language) {
                localStorage.setItem("taxi-varga.at-language", language);
                this.translate.use(language);
                // change lang in index.html to prevent unwanted google translation
                this.document.querySelector('html')?.setAttribute('lang', language);
                return;
            }
        }
        
        this.document.querySelector('html')?.setAttribute('lang', 'de');
        this.translate.use(LanguageOptions.de);
    }
}