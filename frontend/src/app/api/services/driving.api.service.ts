import { HttpResponse } from '@angular/common/http';
import { inject, Injectable } from "@angular/core";
import * as DrivingRequest from "../interfaces/driving-request.interface";
import * as DrivingResponse from "../interfaces/driving-response.interface";
import { catchError, Observable, throwError } from "rxjs";
import { DateTimeService } from '../../shared/services/datetime.service';
import { ServiceRoute } from '../routes/service.route.enum';
import { environment } from '../../../environments/environment';
import { AbstractApiServiceClass } from './abstract.api.service';

@Injectable({
    providedIn: 'root'
})
export class DrivingAPIService extends AbstractApiServiceClass {

    private readonly datetimeService = inject(DateTimeService);
    
    private domainPathV1 = '/api/v1/driving';

    private urlAirport = this.isDevEnv 
        ? `${this.domainPathV1}/${ServiceRoute.AIRPORT}`
        : `${environment.API_BASE_URL.trim()}${this.domainPathV1}/${ServiceRoute.AIRPORT}`;

    private urlDestination = this.isDevEnv 
        ? `${this.domainPathV1}/${ServiceRoute.DESTINATION}`
        : `${environment.API_BASE_URL.trim()}${this.domainPathV1}/${ServiceRoute.DESTINATION}`;

    private urlFlatrate = this.isDevEnv 
        ? `${this.domainPathV1}/${ServiceRoute.FLATRATE}`
        : `${environment.API_BASE_URL.trim()}${this.domainPathV1}/${ServiceRoute.FLATRATE}`;

    private urlGolf = this.isDevEnv 
        ? `${this.domainPathV1}/${ServiceRoute.GOLF}`
        : `${environment.API_BASE_URL.trim()}${this.domainPathV1}/${ServiceRoute.GOLF}`;

    private urlQuick = this.isDevEnv 
        ? `${this.domainPathV1}/${ServiceRoute.QUICK}`
        : `${environment.API_BASE_URL.trim()}${this.domainPathV1}/${ServiceRoute.QUICK}`;


    private dataAirport: DrivingRequest.DrivingAirportRequest = {
        origin: '',
        originDetails: null,
        destination: '',
        destinationDetails: null
    };

    private dataDestination: DrivingRequest.DrivingDestinationRequest = {
        origin: '',
        originDetails: null,
        destination: '',
        destinationDetails: null,
        back2home: false,
        latency: 0,
        pickupTIME: 0
    };

    private dataFlatrate: DrivingRequest.DrivingFlatrateRequest = {
        origin: '',
        originDetails: null,
        destination: '',
        destinationDetails: null,
        tenancy: 0
    };

    private dataGolf: DrivingRequest.DrivingGolfRequest = {
        origin: '',
        originDetails: null,
        golfcourse: '',
        golfcourseDetails: null,
        destination: '',
        destinationDetails: null,
        stay: 0,
        supportMode: false,
        passengers: 1
    };

    private dataQuick: DrivingRequest.DrivingQuickRequest = {
        origin: '',
        originDetails: null,
        destination: '',
        destinationDetails: null,
        latency: 0,
        back2origin: false,
        pickupTIME: '00:00',
    };

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
            supportMode: data.supportMode,
            passengers: Number(data.passengers)
        };
    }

    setDataQuick(data: any, originByGeocode: boolean) {
        this.dataQuick = {
            origin: this.utils.configAPIAddressString(originByGeocode ? data.originAddressByGeocode : data.originAddress),
            originDetails: originByGeocode ? data.originDetailsByGeocode : data.originDetails,
            destination: this.utils.configAPIAddressString(data.destinationAddress),
            destinationDetails: data.destinationDetails,
            latency: this.datetimeService.getTimeInTotalMinutes(data.latency),
            back2origin: data.back2origin,
            pickupTIME: data.pickupTIME
        }
    }

    sendAirportRequest(): Observable<HttpResponse<DrivingResponse.DrivingAirportResponse>> {
        return this.http.post<DrivingResponse.DrivingAirportResponse>(this.urlAirport, this.dataAirport, { observe: 'response' }).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    sendDestinationRequest(): Observable<HttpResponse<DrivingResponse.DrivingDestinationResponse>> {
        return this.http.post<DrivingResponse.DrivingDestinationResponse>(this.urlDestination, this.dataDestination, { observe: 'response' }).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    sendFlatrateRequest(): Observable<HttpResponse<DrivingResponse.DrivingFlatrateResponse>> {
        return this.http.post<DrivingResponse.DrivingFlatrateResponse>(this.urlFlatrate, this.dataFlatrate, { observe: 'response' }).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    sendGolfRequest(): Observable<HttpResponse<DrivingResponse.DrivingGolfResponse>> {
        return this.http.post<DrivingResponse.DrivingGolfResponse>(this.urlGolf, this.dataGolf, { observe: 'response' }).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }

    sendQuickRequest(): Observable<HttpResponse<DrivingResponse.DrivingQuickResponse>> {
        return this.http.post<DrivingResponse.DrivingQuickResponse>(this.urlQuick, this.dataQuick, { observe: 'response' }).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );
    }
}