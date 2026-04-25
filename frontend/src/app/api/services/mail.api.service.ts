import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MailingMessage, MailingRequest } from "../interfaces/mailing-request.interface";
import { DateTimeService } from "../../shared/services/datetime.service";
import { CustomTranslateService } from "../../shared/services/custom-translate.service";
import { UtilsService } from "../../shared/services/utils.service";
import { CryptoService } from "../../shared/services/crypto.service";
import { environment } from "../../../environments/environment";
import { ServiceRoute } from "../routes/service.route.enum";
import { AirportOptions } from "../../shared/enums/airport-options.enum";
import { LanguageOptions } from "../../shared/enums/language-options.enum";
import { catchError, throwError } from "rxjs";
import { default as baseEN } from "../../../../public/assets/i18n/en.json";
import { default as baseDE } from "../../../../public/assets/i18n/de.json";

@Injectable({
    providedIn: 'root'
})
export class MailAPIService {
    private mailData: MailingRequest;
    private urlSend: string;
    private mailSubject: string;

    constructor(
        private readonly http: HttpClient,
        private readonly utils: UtilsService,
        private readonly crypto: CryptoService,
        private readonly datetimeService: DateTimeService,
        private readonly customTranslate: CustomTranslateService
    ) {
        this.mailData = {
            sender: '',
            subject: '',
            body: ''
        }

        this.mailSubject = '';
        
        try {
            this.mailSubject = environment.MAIL_SUBJECT;
        } catch(err) {
            console.log("MailService: env var MAIL_SUBJECT not found", err);
            // TODO(yqni13): client side exception handling missing
        }

        // this.urlSend = '/api/v1/mailing/send';
        this.urlSend = environment.API_BASE_URL + '/api/v1/mailing/send';
    }

    async setMailData(data: MailingMessage) {

        data.phone = this.utils.configPhoneNumber(data.phone);
        const translateData = this.setTranslationValues(data);
        const newData: any = data;
        Object.entries(translateData).forEach(([k, v]) => {
            Object.assign(newData, {[k]: v});
        })

        try {
            this.mailData = {
                sender: await this.crypto.encryptRSA(data.email),
                subject: await this.crypto.encryptRSA(this.mailSubject),
                body: await this.crypto.encryptAES(JSON.stringify(newData))
            };
        } catch(err) {
            console.log("Mail could not be send due to loading error: ", err);
        }
    }

    setTranslationValues(data: MailingMessage): any {
        return {
            originTranslateDE: data.service === ServiceRoute.AIRPORT && data.airportMode === AirportOptions.ARRIVAL
                ? this.customTranslate.getTranslationFromSource('modules.service.content.airport.vie-schwechat', baseDE)
                : data.originAddress,
            originTranslateEN: data.service === ServiceRoute.AIRPORT && data.airportMode === AirportOptions.ARRIVAL
                ? this.customTranslate.getTranslationFromSource('modules.service.content.airport.vie-schwechat', baseEN)
                : data.originAddress,
            golfcourseTranslateDE: data.service === ServiceRoute.GOLF ? data.golfcourseAddress : '',
            golfcourseTranslateEN: data.service === ServiceRoute.GOLF ? data.golfcourseAddress : '',
            destinationTranslateDE: data.service === ServiceRoute.AIRPORT && data.airportMode === AirportOptions.DEPARTURE
                ? this.customTranslate.getTranslationFromSource('modules.service.content.airport.vie-schwechat', baseDE)
                : data.destinationAddress,
            destinationTranslateEN: data.service === ServiceRoute.AIRPORT && data.airportMode === AirportOptions.DEPARTURE
                ? this.customTranslate.getTranslationFromSource('modules.service.content.airport.vie-schwechat', baseEN)
                : data.destinationAddress, 
            serviceTranslateDE: this.customTranslate.getTranslationFromSource(`shared.enum.service.${data.service}`, baseDE),
            serviceTranslateEN: this.customTranslate.getTranslationFromSource(`shared.enum.service.${data.service}`, baseEN),
            genderTranslateDE: this.customTranslate.getTranslationFromSource(`shared.enum.gender.${data.gender}`, baseDE),
            genderTranslateEN: this.customTranslate.getTranslationFromSource(`shared.enum.gender.${data.gender}`, baseEN),
            pickupTimeEN: this.datetimeService.getTimeFromLanguage(data.pickupTIME, LanguageOptions.EN),
            dropOffTimeEN: data.dropOffTIME 
                ? this.datetimeService.getTimeFromLanguage(data.dropOffTIME, LanguageOptions.EN) 
                : '',
            hasLatency: data.latency ? this.datetimeService.getTimeInTotalMinutes(data.latency) > 0 : false
        }
    }

    sendMail() {
        return this.http.post(this.urlSend, this.mailData, { observe: 'response' }).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        );        
    }
}