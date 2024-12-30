/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, of, tap } from "rxjs";
import { HttpObservationService } from "./shared/services/http-observation.service";

export function appHttpInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const httpObservationService = inject(HttpObservationService);
    return next(req).pipe(
        tap((httpEvent) => {
            if((httpEvent as HttpResponse<any>).status === HttpStatusCode.Ok) {
                const httpbody = (httpEvent as HttpResponse<any>);
                if(httpbody.body.title && httpbody.body.text) {
                    console.log('successful communication!');
                }
                if(httpbody.url?.includes('/driving/airport')) {
                    setTimeout(() => {
                        httpObservationService.setDrivingAirportStatus(true);
                    }, 1000);
                } else if(httpbody.url?.includes('/driving/destination')) {
                    setTimeout(() => {
                        httpObservationService.setDrivingDestinationStatus(true);
                    }, 1000);
                } else if(httpbody.url?.includes('/driving/flatrate')) {
                    setTimeout(() => {
                        httpObservationService.setDrivingFlatrateStatus(true);
                    }, 1000);
                } else if(httpbody.url?.includes('/mailing/send')) {
                    setTimeout(() => {
                        httpObservationService.setEmailStatus(true);
                    }, 1000);
                }
            }
        }),
        catchError((response) => {
            console.log('response: ', response);
            if(response.status === 500 || response.status === 535) {
                console.log('snackbar?');
            }
            if(response.url.includes('/driving/airport')) {
                setTimeout(() => {
                    httpObservationService.setDrivingAirportStatus(false);
                }, 1000);
            } else if(response.url.includes('/driving/destination')) {
                setTimeout(() => {
                    httpObservationService.setDrivingDestinationStatus(false);
                }, 1000)
            } else if(response.url.includes('/driving/flatrate')) {
                setTimeout(() => {
                    httpObservationService.setDrivingFlatrateStatus(false);
                }, 1000)
            } else if(response.url.includes('/mailing/send')) {
                setTimeout(() => {
                    httpObservationService.setEmailStatus(false);
                }, 1000)
            }
            return of(response);
        })
    )
}