import { HttpResponse } from '@angular/common/http';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as DrivingRequest from "../interfaces/driving-request.interface";
import * as DrivingResponse from "../interfaces/driving-response.interface";
import { Observable } from "rxjs";
import { DateTimeService } from './datetime.service';
import { environment } from '../../../environments/environment';

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

    constructor(
        private readonly http: HttpClient,
        private readonly datetimeService: DateTimeService
    ) {
        // this.urlAirport = '/api/v1/driving/airport'
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
            back2home: false,
            latency: 0
        };
        this.dataFlatrate = {
            origin: '',
            destination: '',
            tenancy: 0
        }
    }

    setDataAirport(data: any) {
        const airport = 'vie-schwechat';
        this.dataAirport = {
            origin: data.originAddress !== airport 
                ? this.configAddressString(data.originAddress) 
                : data.originAddress,
            destination: data.destinationAddress !== airport 
                ? this.configAddressString(data.destinationAddress) 
                : data.destinationAddress,
        }
    }

    setDataDestination(data: any) {
        this.dataDestination = {
            origin: this.configAddressString(data.originAddress),
            destination: this.configAddressString(data.destinationAddress),
            back2home: data.back2home,
            latency: this.datetimeService.getTimeInTotalMinutes(data.latency)
        };
    }

    setDataFlatrate(data: any) {
        this.dataFlatrate = {
            origin: this.configAddressString(data.originAddress),
            destination: this.configAddressString(data.destinationAddress),
            tenancy: this.datetimeService.getTimeInTotalMinutes(data.tenancy)
        };
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