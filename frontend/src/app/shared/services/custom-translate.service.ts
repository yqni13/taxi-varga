/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TranslateExtendedParams, TranslationParams } from "../interfaces/translate.interface";

@Injectable({
    providedIn: 'root'
})
export class CustomTranslateService {

    constructor(
        private readonly translate: TranslateService,
    ) {
        //
    }

    apply(path: string): string {
        if(path === '' || path.includes('undefined')) {
            return this.getDefaultErrorTranslation();
        } else if(!path.includes('#')) {
            return this.translate.instant(path);
        }
        const params = this.toTranslationParams(path);

        return this.getExtendedTranslation(params);
    }

    /**
     * @description Map dynamic values from path and convert path to be readable in translations again.
     */
    private toTranslationParams(path: string): TranslationParams {
        const params: TranslateExtendedParams = {};
        if(path.includes('!')) {
            const substring = path.substring(path.indexOf('!'), path.length);
            path = path.replace(substring, '');
            params.max = substring.replace('!', '');
        }
        if(path.includes('?')) {
            const substring = path.substring(path.indexOf('?'), path.length);
            path = path.replace(substring, '');
            params.min = substring.replace('?', '');
        }
        if(path.includes('$')) {
            const substring = path.substring(path.indexOf('$'), path.length);
            path = path.replace(substring, '');
            params.len = substring.replace('$', '');
        }
        if(path.includes('#')) {
            const substring = path.substring(path.indexOf('#'), path.length);
            path = path.replace(substring, '');
            params.val = substring.replace('#', '');
        }
        return { path: path, valParams: params };
    }

    /**
     * @description Map all dynamic values into the returning translated title/text.
     */
    private getExtendedTranslation(data: TranslationParams): string {
        const accessKeys: string[] = [];
        let start = 0;

        // Get all validation scripts for the current language.
        const resource = this.translate.translations[this.translate.currentLang] as any;

        // '.' is not a RegExp obj => needs 'g' flag to avoid TypeError
        [...data.path.matchAll(new RegExp('.', 'g'))].map(char => {
            if(char[0] === '.') {
                accessKeys.push(data.path.slice(start, char.index));
                start = char.index + 1;
            } else if (data.path.length-1 === char.index) {
                accessKeys.push(data.path.slice(start, char.index+1));
            }
        });

        let result = accessKeys.reduce((prev, curr) => prev?.[curr], resource);
        if(data.valParams && data.valParams.val && result.includes('{{VAL}}')){
            result = result.replace('{{VAL}}', data.valParams.val);
        }
        if(data.valParams && data.valParams.len && result.includes('{{LENGTH}}')) {
            result = result.replace('{{LENGTH}}', data.valParams.len);
        }
        if(data.valParams && data.valParams.min && result.includes('{{MIN}}')) {
            result = result.replace('{{MIN}}', data.valParams.min);
        }
        if(data.valParams && data.valParams.max && result.includes('{{MAX}}')) {
            result = result.replace('{{MAX}}', data.valParams.max);
        }

        return result ? result : this.getDefaultErrorTranslation();
    }

    private getDefaultErrorTranslation(): string {
        return this.translate.instant('validation.backend.header.UnknownException');
    }
}