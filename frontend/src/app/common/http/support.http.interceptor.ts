import { Injectable } from "@angular/core";
import { SnackbarMessageService } from "../../shared/services/snackbar.service";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { HttpResponse } from "@angular/common/http";
import { SnackbarOption } from "../../shared/enums/snackbar-options.enum";
import { SupportRoute } from "../../api/routes/support.route.enum";

@Injectable({
    providedIn: 'root'
})
export class SupportHttpInterceptor {

    constructor(
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
            this.snackbarService.notify({
                title: path,
                autoClose: true,
                type: SnackbarOption.SUCCESS,
                displayTime: 1500
            });
        } else if(httpBody.url?.includes(`/${SupportRoute.TICKETS}/create`)) {
            this.httpObservationService.setSupportStatus(true);
            this.snackbarService.notify({
                title: 'validation.frontend.support.title',
                text: 'validation.frontend.support.text',
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