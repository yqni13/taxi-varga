/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AddressAutocompleteRequest, AddressDetailsRequest, AddressGelocationRequest } from "../interfaces/address-request.interface";
import { UtilsService } from "./utils.service";
import { Observable } from "rxjs";
import { AddressFilterOptions } from "../enums/addressfilter-options.enum";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AddressAPIService {

    private urlAutocomplete: string;
    private urlDetails: string;
    private urlGeolocation: string;
    private domainPathV1: string;

    private dataAutocomplete: AddressAutocompleteRequest;
    private dataDetails: AddressDetailsRequest;
    private dataGeolocation: AddressGelocationRequest;

    constructor(
        private readonly http: HttpClient,
        private readonly utils: UtilsService
    ) {
        this.domainPathV1 = '/api/v1/address';

        // this.urlAutocomplete = `${this.domainPathV1}/autocomplete`;
        // this.urlDetails = `${this.domainPathV1}/details`;
        // this.urlGeolocation = `${this.domainPathV1}/geocode`;
        this.urlAutocomplete = `${environment.API_BASE_URL}${this.domainPathV1}/autocomplete`;
        this.urlDetails = `${environment.API_BASE_URL}${this.domainPathV1}/details`;
        this.urlGeolocation = `${environment.API_BASE_URL}${this.domainPathV1}/geocode`;

        this.dataAutocomplete = {
            address: '',
            language: '',
            filter: AddressFilterOptions.NOSPEC,
            sessionToken: ''
        };

        this.dataDetails = {
            placeId: '',
            language: '',
            sessionToken: ''
        };

        this.dataGeolocation = {
            latitude: '',
            longitude: '',
            language: ''
        };
    }

    setDataAutocomplete(data: any) {
        this.dataAutocomplete = {
            address: this.utils.configAPIAddressString(data.address),
            language: data.language,
            filter: data.filter,
            sessionToken: data.sessionToken
        }
    }

    setDataDetails(data: any) {
        this.dataDetails = {
            placeId: data.placeId,
            language: data.language,
            sessionToken: data.sessionToken
        }
    }

    setDataGeolocation(data: any) {
        this.dataGeolocation = {
            latitude: data.latitude,
            longitude: data.longitude,
            language: data.language
        }
    }

    sendAutocompleteRequest(): Observable<HttpResponse<any>> {
        return this.http.post<any>(this.urlAutocomplete, this.dataAutocomplete, { observe: 'response' });
    }

    sendDetailsRequest(): Observable<HttpResponse<any>> {
        return this.http.post<any>(this.urlDetails, this.dataDetails, { observe: 'response' });
    }

    sendGeolocationRequest(): Observable<HttpResponse<any>> {
        return this.http.post<any>(this.urlGeolocation, this.dataGeolocation, { observe: 'response' });
    }
}