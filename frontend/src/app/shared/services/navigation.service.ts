/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { Route, Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class NavigationService {

    constructor(private router: Router) {
        //
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