/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { default as langEN } from "../../../../public/assets/i18n/en.json";
import { default as langDE } from "../../../../public/assets/i18n/de.json";

@Injectable({
    providedIn: 'root'
})
export class MailTranslateService {

    private dataEN: any;
    private dataDE: any;

    constructor() {
        try {
            this.dataEN = langEN;
            this.dataDE = langDE;
        } catch(err) {
            this.dataEN = {};
            this.dataDE = {};
            console.log(err);
        }
    }

    getTranslationEN(path: string): string {
        if(path === '' || path === undefined) {
            return '[TRANSLATION PATH NOT FOUND]';
        }

        return this.getTranslationByStringPath(path, this.dataEN);
    }

    getTranslationDE(path: string): string {
        if(path === '' || path === undefined) {
            return '[TRANSLATION PATH NOT FOUND]';
        }

        return this.getTranslationByStringPath(path, this.dataDE);
    }

    getTranslationByStringPath(path: string, dataLang: any): string {
        const accessKeys: string[] = [];
        let start = 0;
        
        // '.' is not a RegExp obj => needs 'g' flag to avoid TypeError
        [...path.matchAll(new RegExp('.', 'g'))].map(char => {
            if(char[0] === '.') {
                accessKeys.push(path.slice(start, char.index));
                start = char.index + 1;
            } else if (path.length-1 === char.index) {
                accessKeys.push(path.slice(start, char.index+1));
            }
        });
        const result = accessKeys.reduce((prev, curr) => prev?.[curr], dataLang);
        return result !== undefined ? result : 'TRANSLATION PATH INVALID';
    }

}