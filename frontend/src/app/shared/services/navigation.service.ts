/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { Route, Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class NavigationService {

    private currentUrl: string;
    private previousUrl: string;

    constructor(private router: Router) {
        this.currentUrl = '';
        this.previousUrl = '';
    }

    setCurrentUrl(url: string) {
        if(url.length < 1) {
            this.currentUrl = 'UNAVAILABLE';
            return;
        }

        this.currentUrl = url;
    }

    getCurrentUrl(): string {
        return this.currentUrl;
    }

    setPreviousUrl(url: string) {
        if(url.length < 1) {
            this.previousUrl = 'UNAVAILABLE';
            return;
        }

        this.previousUrl = url;
    }

    getPreviousUrl(): string {
        return this.previousUrl;
    }

    getNavigationRoutes(): Route[] {
        return this.router.config
            .flatMap((route: any) => [route, ...(route.children || [])])
            .filter((route: any) => route.data?.["showInNavbar"]);
    }

    getFootertRoutes(): Route[] {
        return this.router.config
            .flatMap((route: any) => [route, ...(route.children || [])])
            .filter((route: any) => route.data?.["showInFooter"]);
    }
}