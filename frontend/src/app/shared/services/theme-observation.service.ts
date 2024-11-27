import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ThemeOptions } from "../enums/theme-options.enum";

@Injectable({
    providedIn: 'root'
})
export class ThemeObservationService {

    private themeOptionSubject = new BehaviorSubject<ThemeOptions>(ThemeOptions.darkMode);
    themeOption$ = this.themeOptionSubject.asObservable();

    setThemeOption(theme: ThemeOptions) {
        this.themeOptionSubject.next(theme);
    }
}