/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, of, tap } from "rxjs";
import { HttpObservationService } from "./shared/services/http-observation.service";
import { SnackbarMessageService } from "./shared/services/snackbar.service";
import { SnackbarOption } from "./shared/enums/snackbar-options.enum";
import { MailTranslateService } from "./shared/services/mail-translate.service";
import { TranslateService } from "@ngx-translate/core";
// import { CryptoService } from "./shared/services/crypto.service";

export function appHttpInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const httpObservationService = inject(HttpObservationService);
    const mailTranslateService = inject(MailTranslateService);
    const snackbarService = inject(SnackbarMessageService);
    const translate = inject(TranslateService);
    // const crypto = inject(CryptoService);
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
                } else if(httpbody.url?.includes('/driving/golf')) {
                    await delay(1000);
                    httpObservationService.setDrivingGolfStatus(true);
                } else if(httpbody.url?.includes('/mailing/send')) {
                    await delay(1000);
                    httpObservationService.setEmailStatus(true);
                    // TODO(yqni13): clean after decision for what to keep
                    // const param = httpbody.body.body.response.sender;
                    // const decryptSender = await crypto.decryptRSA(param);
                    snackbarService.notify({
                        title: translate.currentLang === 'en'
                            ? mailTranslateService.getTranslationEN('common.interceptor.email.success-title')
                            : mailTranslateService.getTranslationDE('common.interceptor.email.success-title'),
                        text: translate.currentLang === 'en'
                            ? mailTranslateService.getTranslationEN('common.interceptor.email.success-text') + 'via Email'
                            : mailTranslateService.getTranslationDE('common.interceptor.email.success-text') + 'via Email',
                        autoClose: false,
                        type: SnackbarOption.SUCCESS,
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

    if(response.url.includes('/driving/airport')) {
        await delay(1000);
        httpObservationService.setDrivingAirportStatus(false);
    } else if(response.url.includes('/driving/destination')) {
        await delay(1000);
        httpObservationService.setDrivingDestinationStatus(false);
    } else if(response.url.includes('/driving/flatrate')) {
        await delay(1000);
        httpObservationService.setDrivingFlatrateStatus(false);
    } else if(response.url.includes('/driving/golf')) {
        await delay(1000);
        httpObservationService.setDrivingGolfStatus(false);
    } else if(response.url.includes('/mailing/send')) {
        await delay(1000);
        httpObservationService.setEmailStatus(false);
    }

    // user response log
    if(response.status === 0 && 
        (response.url.includes('/driving/') 
        || response.url.includes('/mailing/')
        || response.url.includes('/address/'))) {
        Object.assign(response, {
            error: {
                headers: {
                    error: 'InternalServerException',
                    message: 'backend-500-server'
                }
            }
        })
        const currentLang = translateService.currentLang;
        const path = 'common.validation.validate-backend';
        snackbarService.notify({
            title: currentLang === 'de' 
                ? mailTranslateService.getTranslationDE(`${path}.header.InternalServerException`)
                : mailTranslateService.getTranslationEN(`${path}.header.InternalServerException`),
            text: currentLang === 'de'
                ? mailTranslateService.getTranslationDE(`${path}.data.backend-500-routes`)
                : mailTranslateService.getTranslationEN(`${path}.data.backend-500-routes`),
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
        const currentLang = translateService.currentLang;
        const path = 'common.validation.validate-backend';
        snackbarService.notify({
            title: currentLang === 'de' 
                ? mailTranslateService.getTranslationDE(`${path}.header.InternalServerException`)
                : mailTranslateService.getTranslationEN(`${path}.header.InternalServerException`),
            text: currentLang === 'de'
                ? mailTranslateService.getTranslationDE(`${path}.data.backend-500-server`)
                : mailTranslateService.getTranslationEN(`${path}.data.backend-500-server`),
            autoClose: false,
            type: SnackbarOption.ERROR
        })
    } 
    // PROPERTY VALIDATION
    else if(response.status === 400) {
        const currentLang = translateService.currentLang;
        const path = 'common.validation.validate-backend';
        // multiple backend messages only for property validations expected
        Object.values(response.error.headers.data).forEach((data: any) => {
            snackbarService.notify({
                title: currentLang === 'de' 
                    ? mailTranslateService.getTranslationDE(`${path}.header.${response.error.headers.error}`)
                    : mailTranslateService.getTranslationEN(`${path}.header.${response.error.headers.error}`),
                text: currentLang === 'de'
                    ? mailTranslateService.getTranslationDE(`${path}.data.${data.msg}`)
                    : mailTranslateService.getTranslationEN(`${path}.data.${data.msg}`),
                autoClose: false,
                type: SnackbarOption.ERROR,
            })
        })
    } 
    // AUTHORIZATION | AUTHENTICATION
    else if(response.status === 401 || response.status === 404 || response.status === 429) {
        const currentLang = translateService.currentLang;
        const path = 'common.validation.validate-backend';
        let env: string | undefined = undefined;
        let message = String(response.error.headers.message);
        if(message.includes('backend-404-env#')) {
            env = message.replace('backend-404-env#', '');
            message = message.replace(`#${env}`, '');
        }
        snackbarService.notify({
            title: currentLang === 'de' 
                ? mailTranslateService.getTranslationDE(`${path}.header.${response.error.headers.error}`)
                : mailTranslateService.getTranslationEN(`${path}.header.${response.error.headers.error}`),
            text: currentLang === 'de'
                ? mailTranslateService.getTranslationDE(`${path}.data.${message}`, env)
                : mailTranslateService.getTranslationEN(`${path}.data.${message}`, env),
            autoClose: false,
            type: SnackbarOption.ERROR,
        })
    } 
    // OTHER VALIDATION
    else if(response.status >= 402 && response.status < 500 || response.status === 535) {
        snackbarService.notify({
            title: response.error.headers.error,
            text: response.error.headers.message,
            autoClose: false,
            type: SnackbarOption.ERROR,
        })
    }

    // browser response log
    console.log('response error: ', response);
    httpObservationService.setErrorStatus(response);
}
