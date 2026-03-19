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
    private drivingGolfStatusSubject = new BehaviorSubject<boolean>(false);
    private drivingQuickStatusSubject = new BehaviorSubject<boolean>(false);
    private ratingStatusSubject = new BehaviorSubject<boolean>(false);
    private feedbackStatusSubject = new BehaviorSubject<boolean>(false);
    private supportStatusSubject = new BehaviorSubject<boolean>(false);
    private emailStatusSubject = new BehaviorSubject<boolean | null>(null);
    private errorStatusSubject = new BehaviorSubject<any>(null);

    drivingAirportStatus$ = this.drivingAirportStatusSubject.asObservable();
    drivingDestinationStatus$ = this.drivingDestinationStatusSubject.asObservable();
    drivingFlatrateStatus$ = this.drivingFlatrateStatusSubject.asObservable();
    drivingGolfStatus$ = this.drivingGolfStatusSubject.asObservable();
    drivingQuickStatus$ = this.drivingQuickStatusSubject.asObservable();
    ratingStatus$ = this.ratingStatusSubject.asObservable();
    feedbackStatus$ = this.feedbackStatusSubject.asObservable();
    supportStatus$ = this.supportStatusSubject.asObservable();
    emailStatus$ = this.emailStatusSubject.asObservable();
    errorStatus$ = this.errorStatusSubject.asObservable();

    setDrivingAirportStatus(isStatus200: boolean) {
        this.drivingAirportStatusSubject.next(isStatus200);
    }

    setDrivingDestinationStatus(isStatus200: boolean) {
        this.drivingDestinationStatusSubject.next(isStatus200);
    }

    setDrivingFlatrateStatus(isStatus200: boolean) {
        this.drivingFlatrateStatusSubject.next(isStatus200);
    }

    setDrivingGolfStatus(isStatus200: boolean) {
        this.drivingGolfStatusSubject.next(isStatus200);
    }

    setDrivingQuickStatus(isStatus200: boolean) {
        this.drivingQuickStatusSubject.next(isStatus200);
    }

    setRatingStatus(isStatus200: boolean) {
        this.ratingStatusSubject.next(isStatus200);
    }

    setFeedbackStatus(isStatus200: boolean) {
        this.feedbackStatusSubject.next(isStatus200);
    }

    setSupportStatus(isStatus200: boolean) {
        this.supportStatusSubject.next(isStatus200);
    }

    setEmailStatus(isStatus200: boolean) {
        this.emailStatusSubject.next(isStatus200);
    }

    setErrorStatus(error: any) {
        this.errorStatusSubject.next(error);
    }
}