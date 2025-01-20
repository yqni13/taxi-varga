/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AddressAutocompleteRequest, AddressDetailsRequest } from "../interfaces/address-request.interface";
import { UtilsService } from "./utils.service";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AddressAPIService {

    private urlAutocomplete: string;
    private urlDetails: string;

    private dataAutocomplete: AddressAutocompleteRequest;
    private dataDetails: AddressDetailsRequest;

    constructor(
        private readonly http: HttpClient,
        private readonly utils: UtilsService
    ) {
        // this.urlAutocomplete = '/api/v1/address/autocomplete';
        // this.urlDetails = '/api/v1/address/details';
        this.urlAutocomplete = `${environment.API_BASE_URL}/api/v1/address/autocomplete`;
        this.urlDetails = `${environment.API_BASE_URL}/api/v1/address/details`;

        this.dataAutocomplete = {
            address: '',
            language: ''
        };

        this.dataDetails = {
            placeId: '',
            language: ''
        };
    }

    setDataAutocomplete(data: any) {
        this.dataAutocomplete = {
            address: this.utils.configAPIAddressString(data.address),
            language: data.language
        }
    }

    setDataDetails(data: any) {
        this.dataDetails = {
            placeId: data.placeId,
            language: data.language
        }
    }

    sendAutocompleteRequest(): Observable<HttpResponse<any>> {
        return this.http.post<any>(this.urlAutocomplete, this.dataAutocomplete, { observe: 'response' });
    }

    sendDetailsRequest(): Observable<HttpResponse<any>> {
        return this.http.post<any>(this.urlDetails, this.dataDetails, { observe: 'response' });
    }
}