/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class DrivingAPIService {

    private data: any;
    private urlAirport: string;
    private urlDestination: string;
    private urlFlatrate: string;

    constructor(private readonly http: HttpClient) {
        this.urlAirport = environment.API_BASE_URL + '/api/v1/driving/airport'
        this.urlDestination = environment.API_BASE_URL + '/api/v1/driving/destination'
        this.urlFlatrate = environment.API_BASE_URL + '/api/v1/driving/flatrate'
    }
}