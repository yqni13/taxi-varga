import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AddressAutocompleteRequest, AddressDetailsRequest, AddressGelocationRequest } from "../interfaces/address-request.interface";
import { catchError, Observable, throwError } from "rxjs";
import { AddressFilterOptions } from "../../shared/enums/addressfilter-options.enum";
import { environment } from "../../../environments/environment";
import { AbstractApiServiceClass } from "./abstract.api.service";

@Injectable({
    providedIn: 'root'
})
export class AddressAPIService extends AbstractApiServiceClass {

    private domainPathV1 = '/api/v1/address';

    private urlAutocomplete = this.isDevEnv
        ? `${this.domainPathV1}/autocomplete`
        : `${environment.API_BASE_URL.trim()}${this.domainPathV1}/autocomplete`;

    private urlDetails = this.isDevEnv
        ? `${this.domainPathV1}/details`
        : `${environment.API_BASE_URL.trim()}${this.domainPathV1}/details`;
    
    private urlGeolocation = this.isDevEnv
        ? `${this.domainPathV1}/geocode`
        : `${environment.API_BASE_URL.trim()}${this.domainPathV1}/geocode`;

    private dataAutocomplete: AddressAutocompleteRequest = {
        address: '',
        language: '',
        filter: AddressFilterOptions.NOSPEC,
        sessionToken: ''
    };

    private dataDetails: AddressDetailsRequest = {
        placeId: '',
        language: '',
        sessionToken: ''
    };

    private dataGeolocation: AddressGelocationRequest = {
        latitude: '',
        longitude: '',
        language: ''
    };

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
        return this.http.post<any>(this.urlAutocomplete, this.dataAutocomplete, { observe: 'response' }).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    sendDetailsRequest(): Observable<HttpResponse<any>> {
        return this.http.post<any>(this.urlDetails, this.dataDetails, { observe: 'response' }).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    sendGeolocationRequest(): Observable<HttpResponse<any>> {
        return this.http.post<any>(this.urlGeolocation, this.dataGeolocation, { observe: 'response' }).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}