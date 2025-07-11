/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as DrivingRequest from "../interfaces/driving-request.interface";
import * as DrivingResponse from "../interfaces/driving-response.interface";
import { Observable } from "rxjs";
import { DateTimeService } from './datetime.service';
import { UtilsService } from './utils.service';
import { ServiceOptions } from '../enums/service-options.enum';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DrivingAPIService {
    
    private domainPathV1: string;

    private urlAirport: string;
    private urlDestination: string;
    private urlFlatrate: string;
    private urlGolf: string;
    private urlQuick: string;

    private dataAirport: DrivingRequest.DrivingAirportRequest;
    private dataDestination: DrivingRequest.DrivingDestinationRequest;
    private dataFlatrate: DrivingRequest.DrivingFlatrateRequest;
    private dataGolf: any;
    private dataQuick: DrivingRequest.DrivingQuickRequest;

    constructor(
        private readonly http: HttpClient,
        private readonly utils: UtilsService,
        private readonly datetimeService: DateTimeService
    ) {
        this.domainPathV1 = '/api/v1/driving';

        // this.urlAirport = `${this.domainPathV1}/${ServiceOptions.AIRPORT}`;
        // this.urlDestination = `${this.domainPathV1}/${ServiceOptions.DESTINATION}`;
        // this.urlFlatrate = `${this.domainPathV1}/${ServiceOptions.FLATRATE}`;
        // this.urlGolf = `${this.domainPathV1}/${ServiceOptions.GOLF}`;
        // this.urlQuick = `${this.domainPathV1}/${ServiceOptions.QUICK}`;
        this.urlAirport = environment.API_BASE_URL + `${this.domainPathV1}/${ServiceOptions.AIRPORT}`;
        this.urlDestination = environment.API_BASE_URL + `${this.domainPathV1}/${ServiceOptions.DESTINATION}`;
        this.urlFlatrate = environment.API_BASE_URL + `${this.domainPathV1}/${ServiceOptions.FLATRATE}`;
        this.urlGolf = environment.API_BASE_URL + `${this.domainPathV1}/${ServiceOptions.GOLF}`;
        this.urlQuick = environment.API_BASE_URL + `${this.domainPathV1}/${ServiceOptions.QUICK}`;

        this.dataAirport = {
            origin: '',
            originDetails: null,
            destination: '',
            destinationDetails: null
        };
        this.dataDestination = {
            origin: '',
            originDetails: null,
            destination: '',
            destinationDetails: null,
            back2home: false,
            latency: 0,
            pickupTIME: 0
        };
        this.dataFlatrate = {
            origin: '',
            originDetails: null,
            destination: '',
            destinationDetails: null,
            tenancy: 0
        };
        this.dataGolf = {
            origin: '',
            originDetails: null,
            golfcourse: '',
            golfcourseDetails: null,
            destination: '',
            destinationDetails: null,
            stay: 0,
            supportMode: null
        };
        this.dataQuick = {
            origin: '',
            originDetails: null,
            destination: '',
            destinationDetails: null,
            latency: 0,
            back2origin: false,
            pickupTIME: 0,
        }
    }

    setDataAirport(data: any) {
        const airport = 'vie-schwechat';
        this.dataAirport = {
            origin: data.originAddress !== airport 
                ? this.utils.configAPIAddressString(data.originAddress) 
                : data.originAddress,
            originDetails: data.originAddress !== airport
                ? data.originDetails
                : null,
            destination: data.destinationAddress !== airport 
                ? this.utils.configAPIAddressString(data.destinationAddress) 
                : data.destinationAddress,
            destinationDetails: data.destinationAddress !== airport
                ? data.destinationDetails
                : null
        }
    }

    setDataDestination(data: any) {
        this.dataDestination = {
            origin: this.utils.configAPIAddressString(data.originAddress),
            originDetails: data.originDetails,
            destination: this.utils.configAPIAddressString(data.destinationAddress),
            destinationDetails: data.destinationDetails,
            back2home: data.back2home,
            latency: this.datetimeService.getTimeInTotalMinutes(data.latency),
            pickupTIME: this.datetimeService.configHourForPayload(data.pickupTIME)
        };
    }

    setDataFlatrate(data: any) {
        this.dataFlatrate = {
            origin: this.utils.configAPIAddressString(data.originAddress),
            originDetails: data.originDetails,
            destination: this.utils.configAPIAddressString(data.destinationAddress),
            destinationDetails: data.destinationDetails,
            tenancy: this.datetimeService.getTimeInTotalMinutes(data.tenancy)
        };
    }

    setDataGolf(data: any) {
        this.dataGolf = {
            origin: this.utils.configAPIAddressString(data.originAddress),
            originDetails: data.originDetails,
            golfcourse: this.utils.configAPIAddressString(data.golfcourseAddress),
            golfcourseDetails: data.golfcourseDetails,
            destination: this.utils.configAPIAddressString(data.destinationAddress),
            destinationDetails: data.destinationDetails,
            stay: this.datetimeService.getTimeInTotalMinutes(data.stay),
            supportMode: data.supportMode
        };
    }

    setDataQuick(data: any) {
        this.dataQuick = {
            origin: this.utils.configAPIAddressString(data.originAddress),
            originDetails: data.originDetails,
            destination: this.utils.configAPIAddressString(data.destinationAddress),
            destinationDetails: data.destinationDetails,
            latency: this.datetimeService.getTimeInTotalMinutes(data.latency),
            back2origin: data.back2origin,
            pickupTIME: this.datetimeService.configHourForPayload(data.pickupTIME)
        }
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

    sendGolfRequest(): Observable<HttpResponse<DrivingResponse.DrivingGolfResponse>> {
        return this.http.post<DrivingResponse.DrivingGolfResponse>(this.urlGolf, this.dataGolf, { observe: 'response' });
    }

    sendQuickRequest(): Observable<HttpResponse<DrivingResponse.DrivingQuickResponse>> {
        return this.http.post<DrivingResponse.DrivingQuickResponse>(this.urlQuick, this.dataQuick, { observe: 'response' });
    }
}