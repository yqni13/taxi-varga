import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ThemeOption } from "../enums/theme-options.enum";

@Injectable({
    providedIn: 'root'
})
export class ThemeObservationService {

    private themeOptionSubject = new BehaviorSubject<ThemeOption>(ThemeOption.darkMode);
    themeOption$ = this.themeOptionSubject.asObservable();

    setThemeOption(theme: ThemeOption) {
        this.themeOptionSubject.next(theme);
    }
}