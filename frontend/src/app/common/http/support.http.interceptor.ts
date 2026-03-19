import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CustomTranslateService } from "../../shared/services/custom-translate.service";
import { SnackbarMessageService } from "../../shared/services/snackbar.service";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { HttpResponse } from "@angular/common/http";
import { SnackbarInput } from "../../shared/enums/snackbar-input.enum";
import { SnackbarOption } from "../../shared/enums/snackbar-options.enum";
import { SupportRoute } from "../../api/routes/support.route.enum";

@Injectable({
    providedIn: 'root'
})
export class SupportHttpInterceptor {

    constructor(
        private readonly translate: TranslateService,
        private readonly customTranslate: CustomTranslateService,
        private readonly snackbarService: SnackbarMessageService,
        private readonly httpObservationService: HttpObservationService
    ) {
        //
    }

    async handleSupportResponse(httpBody: HttpResponse<any>) {
        if(httpBody.url?.includes(`/${SupportRoute.FEEDBACKRATING}/name`)) {
            this.httpObservationService.setRatingStatus(true);
        } else if (httpBody.url?.includes(`/${SupportRoute.FEEDBACK}/create`)) {
            this.httpObservationService.setFeedbackStatus(true);
            const path = 'validation.frontend.interceptor.support-feedback-confirm';
            this.snackbarService.notifyOnInterceptorSuccess({
                path: path,
                closeAuto: true,
                closeTime: 1500
            });
        } else if(httpBody.url?.includes(`/${SupportRoute.TICKETS}/create`)) {
            this.httpObservationService.setSupportStatus(true);
            this.snackbarService.notify({
                title: this.translate.currentLang === 'en'
                ? this.customTranslate.getValidationEN('validation.frontend.support.title', SnackbarInput.TITLE)
                : this.customTranslate.getValidationDE('validation.frontend.support.title', SnackbarInput.TITLE),
            text: this.translate.currentLang === 'en'
                ? this.customTranslate.getValidationEN('validation.frontend.support.text', SnackbarInput.TEXT)
                : this.customTranslate.getValidationDE('validation.frontend.support.text', SnackbarInput.TEXT),
                autoClose: false,
                type: SnackbarOption.SUCCESS,
            });
        }
    }

    async handleSupportError(response: any) {
        if(response.url.includes(`/${SupportRoute.FEEDBACKRATING}/name`)) {
            this.httpObservationService.setRatingStatus(false);
        } else if(response.url.includes(`/${SupportRoute.FEEDBACK}/create`)) {
            this.httpObservationService.setFeedbackStatus(false);
        } else if(response.url.includes(`/${SupportRoute.TICKETS}/create`)) {
            this.httpObservationService.setSupportStatus(false);
        }
    }
}