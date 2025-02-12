import { Injectable } from "@angular/core";
import { ServiceOptions } from "../enums/service-options.enum";

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    private identifier = 'taxi-varga_'

    setToken(key: ServiceOptions, token: string) {
        sessionStorage.setItem(this.identifier + key, token);
    }

    getToken(key: ServiceOptions): string | null {
        return sessionStorage.getItem(this.identifier + key);
    }

    removeToken(key: ServiceOptions) {
        sessionStorage.removeItem(this.identifier + key);
    }

    clearSession() {
        sessionStorage.clear();
    }
}