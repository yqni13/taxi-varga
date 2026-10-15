import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CustomRoute } from "../interfaces/custom-route.interface";

@Injectable({
    providedIn: 'root',
})
export class NavigationService {

    private readonly router = inject(Router);

    private warning = 'UNAVAILABLE';
    private currentUrl = this.warning;
    private previousUrl = this.warning;

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

    getNavigationRoutes(): CustomRoute[] {
        return this.router.config
            .filter((route: any) => route.data?.["showInNavbar"] && route.data!['title'])
            .flatMap((route: any) => [
                { path: route.path, icon: route.data!['icon'], titleKey: route.data!['title'] },
                ...(route.children || [])
            ]);
    }

    getFootertRoutes(): CustomRoute[] {
        return this.router.config
            .filter((route: any) => route.data?.["showInFooter"] && route.data!['title'])
            .flatMap((route: any) => [
                { path: route.path, titleKey: route.data!['title'] },
                ...(route.children || [])
            ]);
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