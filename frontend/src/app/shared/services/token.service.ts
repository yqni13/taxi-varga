import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    private identifier = 'taxi-varga_sessionToken';
    private readonly platformId = inject(PLATFORM_ID);

    setToken(token: string) {
        if(this.checkSessionStorage()) {
            sessionStorage?.setItem(this.identifier, token);
        }
    }

    getToken(): string | null {
        return this.checkSessionStorage() ? sessionStorage?.getItem(this.identifier) : null;
    }

    removeToken() {
        if(this.checkSessionStorage()) {
            sessionStorage?.removeItem(this.identifier);
        }
    }

    private checkSessionStorage(): boolean {
        return isPlatformBrowser(this.platformId) ? true : false;
    }
}