import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AssetsPreloadService } from "../../shared/services/assets-preload.service";
import { catchError, from, map, Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AssetsPreloadGuard implements CanActivate {
    
    constructor(private readonly assetPreload: AssetsPreloadService) {
        //
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        const routeImages: string[] = route.data['preloadImages'] ?? [];
        const routeVideos: string[] = route.data['preloadVideos'] ?? [];

        return from(this.assetPreload.preloadAssets({
            images: routeImages,
            videos: routeVideos
        })).pipe(
            map(() => true),
            catchError(() => of(true))
        );
    }
}