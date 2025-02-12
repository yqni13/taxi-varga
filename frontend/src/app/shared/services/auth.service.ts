/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { DateTimeService } from "./datetime.service";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { CryptoService } from "./crypto.service";
import { ServiceOptions } from "../enums/service-options.enum";


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private url: string;
    private credentials: any;

    constructor(
        private readonly http: HttpClient,
        private readonly crypto: CryptoService,
        private readonly datetime: DateTimeService
    ) {
        this.url = '/api/v1/auth/init';
        // this.url = environment.API_BASE_URL + '/api/v1/auth/init';
        this.credentials = {};
    }

    initSession(service: ServiceOptions) {
        const user = 'guest';
        const addition = this.datetime.getCurrentTimeInMilliseconds();
        this.credentials = {
            user: user,
            pass: this.crypto.encryptData(environment.AUTH_PASSWORD + addition.toString()),
            aud: service
        }
    }

    sendInitRequest(): Observable<HttpResponse<string>> {
        return this.http.post<string>(this.url, this.credentials, { observe: 'response' });
    }
}