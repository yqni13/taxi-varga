import { Injectable } from "@angular/core";
import { Route, Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class NavigationService {

    private currentUrl: string;
    private previousUrl: string;
    private warning = 'UNAVAILABLE';

    constructor(private router: Router) {
        this.currentUrl = this.warning;
        this.previousUrl = this.warning;
    }

    setCurrentUrl(url: string) {
        if(url.length < 1) {
            this.currentUrl = this.warning;
            return;
        }

        this.currentUrl = url;
    }

    getCurrentUrl(): string {
        return this.currentUrl;
    }

    setPreviousUrl(url: string) {
        if(url.length < 1) {
            this.previousUrl = this.warning;
            return;
        }

        this.previousUrl = url === this.warning ? this.previousUrl : url;
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

    getNavigationIconPaths(): string[] {
        return this.router.config
            .flatMap((route: any) => [route, ...(route.children || [])])
            .filter((route: any) => route.data?.["showInNavbar"])
            .map((route: any) => {
                let icon = (route.data?.icon as string).replace(' icon-base', '');
                icon = icon.replace('-', '_');
                return `/assets/app-icons/${icon}.svg`;
            })
    }

    scrollToTop(anchor: HTMLElement, document: Document) {
        if(anchor && document.scrollingElement !== null) {
            HTMLElement.prototype.scrollTo = () => {};
            anchor.scrollTo(0,0);
            // Need to kill the y-offset caused by navbar in mobile mode.
            document.scrollingElement.scrollTop = 0;
        }
    }
}