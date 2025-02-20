/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { DateTimeService } from "./datetime.service";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { CryptoService } from "./crypto.service";
import { ServiceOptions } from "../enums/service-options.enum";
import { environment } from '../../../environments/environment';
import { AuthRequest } from "../interfaces/auth-request.interface";


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private url: string;
    private credentials: AuthRequest;
    private exceptions: string[];
    private statusCodes: string[];

    constructor(
        private readonly http: HttpClient,
        private readonly crypto: CryptoService,
        private readonly datetime: DateTimeService
    ) {
        // this.url = '/api/v1/auth/init';
        this.url = `${environment.API_BASE_URL}/api/v1/auth/init`;
        this.credentials = {
            user: '',
            pass: '',
            aud: ''
        };
        this.exceptions = [
            'JWTExpirationException',
            'TokenMissingException',
            'InvalidCredentialsException',
            'InternalServerException',
            'AuthSecretNotFoundException'
        ];
        this.statusCodes = ['401', '404', '500', '0'];
    }

    getExceptionCollection(): string[] {
        return this.exceptions;
    }

    getExceptionStatusCodes(): string[] {
        return this.statusCodes;
    }

    initSession(service: ServiceOptions) {
        const addition = this.datetime.getCurrentTimeInMilliseconds();
        this.credentials = {
            user: this.crypto.encryptRSA(environment.AUTH_USER),
            pass: this.crypto.encryptRSA(environment.AUTH_PASSWORD + addition.toString()),
            aud: service
        }
    }

    sendInitRequest(): Observable<HttpResponse<any>> {
        return this.http.post<any>(this.url, this.credentials, { observe: 'response' });
    }
}