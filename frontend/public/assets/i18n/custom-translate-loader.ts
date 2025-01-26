/* eslint-disable @typescript-eslint/no-explicit-any */
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class CustomTranslateLoader implements TranslateLoader {

    constructor(
        private http: HttpClient, 
        private prefix = './assets/i18n/', 
        private suffix = '.json'
    ) { 
            //
    }

    public getTranslation(language: string): Observable<any> {
        // list of files each language to load
        const paths = [
            `${this.prefix}${language}.json`,
            `${this.prefix}imprint-${language}.json`,
            `${this.prefix}samples-${language}.json`
        ];

        return forkJoin(paths.map(path => this.http.get(path))).pipe(
            map(response => {
            // combine all json files into single object
                return response.reduce((acc, current) => {
                    return { ...acc, ...current };
                }, {});
            })
        );
    }
}