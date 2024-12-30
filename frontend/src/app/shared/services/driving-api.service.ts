import { HttpResponse } from '@angular/common/http';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import * as DrivingRequest from "../interfaces/driving-request.interface";
import * as DrivingResponse from "../interfaces/driving-response.interface";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DrivingAPIService {

    private urlAirport: string;
    private urlDestination: string;
    private urlFlatrate: string;

    private dataAirport: DrivingRequest.DrivingAirportRequest;
    private dataDestination: DrivingRequest.DrivingDestinationRequest;
    private dataFlatrate: DrivingRequest.DrivingFlatrateRequest;

    constructor(private readonly http: HttpClient) {
        this.urlAirport = environment.API_BASE_URL + '/api/v1/driving/airport'
        this.urlDestination = environment.API_BASE_URL + '/api/v1/driving/destination'
        this.urlFlatrate = environment.API_BASE_URL + '/api/v1/driving/flatrate'
    
        this.dataAirport = {
            origin: '',
            destination: '',
        };
        this.dataDestination = {
            origin: '',
            destination: '',
            back2home: false
        };
        this.dataFlatrate = {
            origin: '',
            destination: '',
            tenancy: ''
        }
    }

    setDataAirport(data: any) {
        this.dataAirport = data;
    }

    setDataDestination(data: any) {
        this.dataDestination = {
            origin: this.configAddressString(data.originAddress),
            destination: this.configAddressString(data.destinationAddress),
            back2home: data.back2home
        };
    }

    setDataFlatrate(data: any) {
        this.dataFlatrate = data;
    }

    configAddressString(data: string): string {
        return data = data.replaceAll(' ', '+');
    }

    sendAirportRequest(): Observable<HttpResponse<DrivingResponse.DrivingAirportResponse>> {
        return this.http.post<DrivingResponse.DrivingAirportResponse>(this.urlAirport, this.dataAirport, { observe: 'response' });
    }

    sendDestinationRequest(): Observable<HttpResponse<DrivingResponse.DrivingDestinationResponse>> {
        return this.http.post<DrivingResponse.DrivingDestinationResponse>(this.urlDestination, this.dataDestination, { observe: 'response' });
    }

    sendFlatrateRequest(): Observable<HttpResponse<DrivingResponse.DrivingFlatrateResponse>> {
        return this.http.post<DrivingResponse.DrivingFlatrateResponse>(this.urlFlatrate, this.dataFlatrate, { observe: 'response' });
    }
}