import { inject, Injectable } from "@angular/core";
import { DateTimeService } from "../../shared/services/datetime.service";
import { catchError, Observable, throwError } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { CryptoService } from "../../shared/services/crypto.service";
import { ServiceRoute } from "../routes/service.route.enum";
import { environment } from '../../../environments/environment';
import { AuthRequest } from "../interfaces/auth-request.interface";
import { default as validationJson } from "../../../../public/assets/i18n/validation-en.json";
import { AbstractApiServiceClass } from "./abstract.api.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService extends AbstractApiServiceClass {

    private readonly crypto = inject(CryptoService);
    private readonly datetime = inject(DateTimeService);
    
    private statusCodes: string[] = ['401', '404', '429', '500', '0'];

    private credentials: AuthRequest = {
        user: '',
        pass: '',
        aud: ''
    };
    
    private url = this.isDevEnv
        ? '/api/v1/auth/init'
        : `${environment.API_BASE_URL.trim()}/api/v1/auth/init`;

    getExceptionCollection(): string[] {
        return Object.keys(validationJson.validation.backend.header);
    }

    getExceptionStatusCodes(): string[] {
        return this.statusCodes;
    }

    async initSession(service: ServiceRoute) {
        const addition = this.datetime.getCurrentTimeInMilliseconds();
        try {
            this.credentials = {
                user: await this.crypto.encryptRSA(environment.AUTH_USER.trim()),
                pass: await this.crypto.encryptRSA(environment.AUTH_PASSWORD.trim() + addition.toString()),
                aud: service
            }
        } catch(err) {
            console.log("Authentication failed because of loading error: ", err);
        }
    }

    sendInitRequest(): Observable<HttpResponse<any>> {
        return this.http.post<any>(this.url, this.credentials, { observe: 'response' }).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}