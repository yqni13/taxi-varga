/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HttpObservationService {

    private drivingAirportStatusSubject = new BehaviorSubject<boolean>(false);
    private drivingDestinationStatusSubject = new BehaviorSubject<boolean>(false);
    private drivingFlatrateStatusSubject = new BehaviorSubject<boolean>(false);
    private emailStatusSubject = new BehaviorSubject<boolean | null>(null);
    private errorStatusSubject = new BehaviorSubject<any>(null);

    drivingAirportStatus$ = this.drivingAirportStatusSubject.asObservable();
    drivingDestinationStatus$ = this.drivingDestinationStatusSubject.asObservable();
    drivingFlatrateStatus$ = this.drivingFlatrateStatusSubject.asObservable();
    emailStatus$ = this.emailStatusSubject.asObservable();
    errorSubject$ = this.errorStatusSubject.asObservable();

    setDrivingAirportStatus(isStatus200: boolean) {
        this.drivingAirportStatusSubject.next(isStatus200);
    }

    setDrivingDestinationStatus(isStatus200: boolean) {
        this.drivingDestinationStatusSubject.next(isStatus200);
    }

    setDrivingFlatrateStatus(isStatus200: boolean) {
        this.drivingFlatrateStatusSubject.next(isStatus200);
    }

    setEmailStatus(isStatus200: boolean) {
        this.emailStatusSubject.next(isStatus200);
    }

    setErrorStatus(error: any) {
        this.errorStatusSubject.next(error);
    }
}