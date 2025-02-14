/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, of, tap } from "rxjs";
import { HttpObservationService } from "./shared/services/http-observation.service";
import { SnackbarMessageService } from "./shared/services/snackbar.service";
import { SnackbarOption } from "./shared/enums/snackbar-options.enum";
import { MailTranslateService } from "./shared/services/mail-translate.service";
import { TranslateService } from "@ngx-translate/core";

export function appHttpInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const httpObservationService = inject(HttpObservationService);
    const mailTranslateService = inject(MailTranslateService);
    const snackbarService = inject(SnackbarMessageService);
    const translate = inject(TranslateService);
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    return next(req).pipe(
        tap(async (httpEvent) => {
            if((httpEvent as HttpResponse<any>).status === HttpStatusCode.Ok) {
                const httpbody = (httpEvent as HttpResponse<any>);
                if(httpbody.body.title && httpbody.body.text) {
                    console.log('successful communication!');
                }
                if(httpbody.url?.includes('/driving/airport')) {
                    await delay(1000);
                    httpObservationService.setDrivingAirportStatus(true);
                } else if(httpbody.url?.includes('/driving/destination')) {
                    await delay(1000);
                    httpObservationService.setDrivingDestinationStatus(true);
                } else if(httpbody.url?.includes('/driving/flatrate')) {
                    await delay(1000);
                    httpObservationService.setDrivingFlatrateStatus(true);
                } else if(httpbody.url?.includes('/mailing/send')) {
                    await delay(1000);
                    httpObservationService.setEmailStatus(true);
                    snackbarService.notify({
                        title: translate.currentLang === 'en'
                            ? mailTranslateService.getTranslationEN('common.interceptor.email.success-title')
                            : mailTranslateService.getTranslationDE('common.interceptor.email.success-title'),
                        text: translate.currentLang === 'en'
                            ? mailTranslateService.getTranslationEN('common.interceptor.email.success-text') + (httpEvent as HttpResponse<any>).body.body.response.sender
                            : mailTranslateService.getTranslationDE('common.interceptor.email.success-text') + (httpEvent as HttpResponse<any>).body.body.response.sender,
                        autoClose: false,
                        type: SnackbarOption.success,
                    })
                }
            }
        }),
        catchError((response) => {
            handleError(response, httpObservationService, snackbarService, mailTranslateService, translate).catch((err) => {
                console.error('Error handling failed', err);
            })
            
            return of(response);
        })
    )
}

export async function handleError(response: any, httpObservationService: HttpObservationService, snackbarService: SnackbarMessageService, mailTranslateService: MailTranslateService, translateService: TranslateService) {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    console.log('response error: ', response);
    if(response.url.includes('/driving/airport')) {
        await delay(1000);
        httpObservationService.setDrivingAirportStatus(false);
    } else if(response.url.includes('/driving/destination')) {
        await delay(1000);
        httpObservationService.setDrivingDestinationStatus(false);
    } else if(response.url.includes('/driving/flatrate')) {
        await delay(1000);
        httpObservationService.setDrivingFlatrateStatus(false);
    } else if(response.url.includes('/mailing/send')) {
        await delay(1000);
        httpObservationService.setEmailStatus(false);
    }
    httpObservationService.setErrorStatus(response);

    if(response.status === 0 && (response.url.includes('/driving/') || response.url.includes('/mailing/'))) {
        snackbarService.notify({
            title: 'Server Connection Error',
            text: 'Connection to the backend missing. Please try again later.',
            autoClose: false,
            type: SnackbarOption.error
        })
    } else if(response.status === 500 || response.status === 535) {
        snackbarService.notify({
            title: response.statusText,
            text: 'Server services failed. Please contact support.',
            autoClose: false,
            type: SnackbarOption.error
        })
    } else if(response.status === 400) {
        const currentLang = translateService.currentLang;
        const path = 'common.validation.validate-backend';
        snackbarService.notify({
            title: currentLang === 'de' 
                ? mailTranslateService.getTranslationDE(`${path}.header.${response.error.headers.error}`)
                : mailTranslateService.getTranslationEN(`${path}.header.${response.error.headers.error}`),
            text: currentLang === 'de'
                ? mailTranslateService.getTranslationDE(`${path}.data.${response.error.headers.data[0].msg}`)
                : mailTranslateService.getTranslationEN(`${path}.data.${response.error.headers.data[0].msg}`),
            autoClose: false,
            type: SnackbarOption.error,
        })
    } else if(response.status === 401) {
        const currentLang = translateService.currentLang;
        const path = 'common.validation.validate-backend';
        const message = response.error.headers.message.replace('Auth Error: ', '');
        snackbarService.notify({
            title: currentLang === 'de' 
                ? mailTranslateService.getTranslationDE(`${path}.header.${response.error.headers.error}`)
                : mailTranslateService.getTranslationEN(`${path}.header.${response.error.headers.error}`),
            text: currentLang === 'de'
                ? mailTranslateService.getTranslationDE(`${path}.data.${message}`)
                : mailTranslateService.getTranslationEN(`${path}.data.${message}`),
            autoClose: true,
            displayTime: 5000,
            type: SnackbarOption.error,
        })
    } else if(response.status > 400 && response.status < 500) {
        snackbarService.notify({
            title: response.error.headers.error,
            text: response.error.headers.message,
            autoClose: false,
            type: SnackbarOption.error,
        })
    }
}
