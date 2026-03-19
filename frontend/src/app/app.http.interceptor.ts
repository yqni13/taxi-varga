/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupportHttpInterceptor } from './common/http/support.http.interceptor';
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { HttpObservationService } from "./shared/services/http-observation.service";
import { SnackbarMessageService } from "./shared/services/snackbar.service";
import { SnackbarOption } from "./shared/enums/snackbar-options.enum";
import { Router } from "@angular/router";
import * as Helper from "./common/helper/common.helper";
import { ServiceRoute } from "./api/routes/service.route.enum";
import { SupportRoute } from "./api/routes/support.route.enum";

export function appHttpInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const httpObservationService = inject(HttpObservationService);
    const supportIntercept = inject(SupportHttpInterceptor);
    const snackbarService = inject(SnackbarMessageService);
    const router = inject(Router);
    const helper = Helper;
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    return next(req).pipe(
        tap(async (httpEvent) => {
            if((httpEvent as HttpResponse<any>).status === HttpStatusCode.Ok) {
                const httpbody = (httpEvent as HttpResponse<any>);
                if(httpbody.body.title && httpbody.body.text) {
                    console.log('successful communication!');
                } else if(httpbody.url?.includes(`/${SupportRoute.FEEDBACK}`)
                || httpbody.url?.includes(`/${SupportRoute.FEEDBACKRATING}`)
                || httpbody.url?.includes(`/${SupportRoute.TICKETS}`)) {
                    supportIntercept.handleSupportResponse(httpEvent as HttpResponse<any>);
                }
                if(httpbody.url?.includes(`/driving/${ServiceRoute.AIRPORT}`)) {
                    await delay(1000);
                    httpObservationService.setDrivingAirportStatus(true);
                } else if(httpbody.url?.includes(`/driving/${ServiceRoute.DESTINATION}`)) {
                    await delay(1000);
                    httpObservationService.setDrivingDestinationStatus(true);
                } else if(httpbody.url?.includes(`/driving/${ServiceRoute.FLATRATE}`)) {
                    await delay(1000);
                    httpObservationService.setDrivingFlatrateStatus(true);
                } else if(httpbody.url?.includes(`/driving/${ServiceRoute.GOLF}`)) {
                    await delay(1000);
                    httpObservationService.setDrivingGolfStatus(true);
                } else if(httpbody.url?.includes(`/driving/${ServiceRoute.QUICK}`)){
                    await delay(1000);
                    httpObservationService.setDrivingQuickStatus(true);
                } else if(httpbody.url?.includes('/mailing/send')) {
                    await delay(1000);
                    httpObservationService.setEmailStatus(true);
                    snackbarService.notify({
                        title: 'common.interceptor.email.success-title',
                        text: 'common.interceptor.email.success-text',
                        autoClose: false,
                        mail: httpbody.body.body.response.sender,
                        type: SnackbarOption.SUCCESS,
                    })
                }
            }
        }),
        catchError((response) => {
            handleError(response, httpObservationService, supportIntercept, snackbarService, router, helper).catch((err) => {
                console.error('Error handling failed', err);
            })

            return throwError(() => response);
        })
    )
}

export async function handleError(response: any, httpObservationService: HttpObservationService, supportIntercept: SupportHttpInterceptor, snackbarService: SnackbarMessageService, router: Router, helper: any) {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const path = 'validation.backend';

    if(response.url.includes(`/${SupportRoute.FEEDBACK}`)
    || response.url.includes(`/${SupportRoute.FEEDBACKRATING}`)
    || response.url.includes(`/${SupportRoute.TICKETS}`)) {
        supportIntercept.handleSupportError(response);
    } else if(response.url.includes(`/driving/${ServiceRoute.AIRPORT}`)) {
        await delay(1000);
        httpObservationService.setDrivingAirportStatus(false);
    } else if(response.url.includes(`/driving/${ServiceRoute.DESTINATION}`)) {
        await delay(1000);
        httpObservationService.setDrivingDestinationStatus(false);
    } else if(response.url.includes(`/driving/${ServiceRoute.FLATRATE}`)) {
        await delay(1000);
        httpObservationService.setDrivingFlatrateStatus(false);
    } else if(response.url.includes(`/driving/${ServiceRoute.GOLF}`)) {
        await delay(1000);
        httpObservationService.setDrivingGolfStatus(false);
    } else if(response.url.includes(`/driving/${ServiceRoute.QUICK}`)) {
        await delay(1000);
        httpObservationService.setDrivingQuickStatus(false);
    } else if(response.url.includes('/mailing/send')) {
        await delay(1000);
        httpObservationService.setEmailStatus(false);
    }

    // user response log
    if(response.status === 0 && 
        (response.url.includes('/driving/') 
        || response.url.includes('/mailing/')
        || response.url.includes('/address/')
        || response.url.includes(`/${SupportRoute.FEEDBACK}`)
        || response.url.includes(`/${SupportRoute.FEEDBACKRATING}`)
        || response.url.includes(`/${SupportRoute.TICKETS}`))) {

        const errorText = response.url.includes(`/${SupportRoute.TICKETS}`)
        || response.url.includes(`/${SupportRoute.FEEDBACK}`)
        || response.url.includes(`/${SupportRoute.FEEDBACKRATING}`)
            ? 'server-500-routes-support'
            : 'backend-500-routes';
        Object.assign(response, {
            error: {
                headers: {
                    error: 'InternalServerException',
                    message: errorText
                }
            }
        })
        snackbarService.notify({
            title: `${path}.header.InternalServerException`,
            text: `${path}.data.${errorText}`,
            autoClose: false,
            type: SnackbarOption.ERROR
        })
    } 
    // SERVER CONNECTION
    else if(response.status === 500) {
        Object.assign(response, {
            error: {
                headers: {
                    error: 'InternalServerException',
                    message: 'backend-500-server'
                }
            }
        })
        snackbarService.notify({
            title: `${path}.header.InternalServerException`,
            text: `${path}.data.${response.error.headers.message}`,
            autoClose: false,
            type: SnackbarOption.ERROR
        })
    } 
    // PROPERTY VALIDATION
    else if(response.status === 400) {
        // multiple backend messages only for property validations expected
        let route: string | null = null;
        Object.values(response.error.headers.data).forEach((data: any) => {
            if(route === null && data.msg.includes('navigate')) {
                const sub = String(data.msg).substring(0, String(data.msg).indexOf('/'));
                route = String(data.msg).replace(sub, '');
            }
            snackbarService.notify({
                title: `${path}.header.${response.error.headers.error}`,
                text: `${path}.data.${data.msg}`,
                autoClose: false,
                type: SnackbarOption.ERROR,
            })
        })
        helper.navigateWithRoute(route, router);
    }
    // MAINTENANCE HANDLING
    else if(response.status === 598) {
        snackbarService.notify({
            title: `${path}.header.${response.error.headers.error}`,
            text: `${path}.data.${response.error.headers.message}`,
            phone: '+436644465466',
            autoClose: false,
            type: SnackbarOption.ERROR,
        })
        helper.navigateWithRoute('/service', router);
    }
    // OTHER VALIDATION
    else if(response.status >= 402 && response.status <= 599) {
        snackbarService.notify({
            title: `${path}.header.${response.error.headers.error}`,
            text: `${path}.data.${response.error.headers.message}`,
            autoClose: false,
            type: SnackbarOption.ERROR,
        })
    }

    // browser response log
    console.log('response error: ', response);
    httpObservationService.setErrorStatus(response);
}
