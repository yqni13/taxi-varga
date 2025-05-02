/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MailingMessage, MailingRequest } from "../interfaces/mailing-request.interface";
import { TranslateService } from "@ngx-translate/core";
import { DateTimeService } from "./datetime.service";
import { MailTranslateService } from "./mail-translate.service";
import { UtilsService } from "./utils.service";
import { CryptoService } from "./crypto.service";
import { environment } from "../../../environments/environment";
import { ServiceOptions } from "../enums/service-options.enum";
import { AirportOptions } from "../enums/airport-options.enum";
import { LanguageOptions } from "../enums/language-options.enum";

@Injectable({
    providedIn: 'root'
})
export class MailAPIService {
    private mailData: MailingRequest;
    private urlSend: string;
    private mailSubject: string;

    private translateData: any;

    constructor(
        private readonly http: HttpClient,
        private readonly utils: UtilsService,
        private readonly crypto: CryptoService,
        private readonly translate: TranslateService,
        private readonly datetimeService: DateTimeService,
        private readonly mailTranslateService: MailTranslateService
    ) {
        this.mailData = {
            sender: '',
            subject: '',
            body: ''
        }

        this.translateData = {
            service: '',
            gender: '',
            origin: '',
            golfcourse: '',
            destination: ''
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
            originTranslateDE: data.service === ServiceOptions.AIRPORT && data.airport === AirportOptions.ARRIVAL
                ? this.mailTranslateService.getTranslationDE('modules.service.content.airport.vie-schwechat')
                : data.originAddress,
            originTranslateEN: data.service === ServiceOptions.AIRPORT && data.airport === AirportOptions.ARRIVAL
                ? this.mailTranslateService.getTranslationEN('modules.service.content.airport.vie-schwechat')
                : data.originAddress,
            golfcourseTranslateDE: data.service === ServiceOptions.GOLF ? data.golfcourseAddress : '',
            golfcourseTranslateEN: data.service === ServiceOptions.GOLF ? data.golfcourseAddress : '',
            destinationTranslateDE: data.service === ServiceOptions.AIRPORT && data.airport === AirportOptions.DEPARTURE
                ? this.mailTranslateService.getTranslationDE('modules.service.content.airport.vie-schwechat')
                : data.destinationAddress,
            destinationTranslateEN: data.service === ServiceOptions.AIRPORT && data.airport === AirportOptions.DEPARTURE
                ? this.mailTranslateService.getTranslationEN('modules.service.content.airport.vie-schwechat')
                : data.destinationAddress, 
            serviceTranslateDE: this.mailTranslateService.getTranslationDE(`shared.enum.service.${data.service}`),
            serviceTranslateEN: this.mailTranslateService.getTranslationEN(`shared.enum.service.${data.service}`),
            genderTranslateDE: this.mailTranslateService.getTranslationDE(`shared.enum.gender.${data.gender}`),
            genderTranslateEN: this.mailTranslateService.getTranslationEN(`shared.enum.gender.${data.gender}`),
            pickupTimeEN: this.datetimeService.getTimeFromLanguage(data.pickupTIME, LanguageOptions.EN),
            dropOffTimeEN: data.dropOffTIME 
                ? this.datetimeService.getTimeFromLanguage(data.dropOffTIME, LanguageOptions.EN) 
                : '',
            hasLatency: data.latency ? this.datetimeService.getTimeInTotalMinutes(data.latency) > 0 : false
        }
    }

    configEmailBodyDE(data: MailingMessage, hasLatency: boolean): string {
        const originTranslateDE = data.service === ServiceOptions.AIRPORT && data.airport === AirportOptions.ARRIVAL
            ? this.mailTranslateService.getTranslationDE('modules.service.content.airport.vie-schwechat')
            : data.originAddress;
        const destinationTranslateDE = data.service === ServiceOptions.AIRPORT && data.airport === AirportOptions.DEPARTURE
            ? this.mailTranslateService.getTranslationDE('modules.service.content.airport.vie-schwechat')
            : data.destinationAddress;
        const serviceTranslateDE = this.mailTranslateService.getTranslationDE(`shared.enum.service.${data.service}`);
        const genderTranslateDE = this.mailTranslateService.getTranslationDE(`shared.enum.gender.${data.gender}`);

        const msgStart = `Anfrage für Service: ${serviceTranslateDE}`;

        const msgCustomer = `Daten zur Person:\n${genderTranslateDE} ${data.title ? data.title + ' ' : ''}${data.firstName} ${data.lastName}\n${data.phone}\n${data.email}\nPersönliche Notiz:\n${data.note ? '"' + data.note + '"' : '--'}`;

        const msgServiceBasic = `Daten zum Service:\nAbholadresse: ${originTranslateDE}\nZieladresse: ${destinationTranslateDE}\n${data.service === ServiceOptions.DESTINATION && data.back2home ? 'Rückkehradresse: ' + data.originAddress + '\n' : ''}Datum der Abholung: ${data.pickupDATE}\nZeitpunkt der Abholung: ${data.pickupTIME} Uhr`;

        const msgServiceFixed = `Fahrtstrecke: ${data.distance} km\nFahrtdauer: ${data.duration} h\n${hasLatency ? 'Verrechnete Wartezeit: ' + data.latency + ' h\n' : ''}Preis: ${data.price},00 EUR`;

        const msgServiceFlatrate = `${data.dropOffDATE && data.pickupDATE !== data.dropOffDATE ? 'Datum der Ankunft: ' + data.dropOffDATE + '\n' : ''}Geschätzte Zeit der Ankunft: ${data.dropOffTIME} Uhr\nVerrechnete Mietdauer: ${data.tenancy} h\nGeschätzter Preis: ${data.price},00 EUR`;

        return `${msgStart}\n\n${msgCustomer}\n\n${msgServiceBasic}\n${data.service === ServiceOptions.FLATRATE ? msgServiceFlatrate : msgServiceFixed}`
    }
    
    configEmailBodyEN(data: MailingMessage, hasLatency: boolean): string {        
        this.translateData.origin = data.service === ServiceOptions.AIRPORT && data.airport === AirportOptions.ARRIVAL
            ? this.mailTranslateService.getTranslationEN('modules.service.content.airport.vie-schwechat')
            : data.originAddress;
        this.translateData.destination = data.service === ServiceOptions.AIRPORT && data.airport === AirportOptions.DEPARTURE
            ? this.mailTranslateService.getTranslationEN('modules.service.content.airport.vie-schwechat')
            : data.destinationAddress;   
        this.translateData.service = this.mailTranslateService.getTranslationEN(`shared.enum.service.${data.service}`);
        this.translateData.gender = this.mailTranslateService.getTranslationEN(`shared.enum.gender.${data.gender}`);

        const msgStart = `Request for service: ${this.translateData.service}`;

        const msgCustomer = `Customer data:\n${this.translateData.gender} ${data.title ? data.title + ' ' : ''}${data.firstName} ${data.lastName}\n${data.phone}\n${data.email}\nCustomer note:\n${data.note ? '"' + data.note + '"' : '--'}`;

        const msgServiceBasic = `Service data:\nPickup address: ${this.translateData.origin}\nDestination address: ${this.translateData.destination}\n${data.service === ServiceOptions.DESTINATION && data.back2home ? 'Return address: ' + data.originAddress + '\n' : ''}Date of pickup: ${data.pickupDATE}\nTime of pickup: ${this.datetimeService.getTimeFromLanguage(data.pickupTIME, LanguageOptions.EN)}`;

        const msgServiceFixed = `Distance: ${data.distance} km\nDuration: ${data.duration} h\n${hasLatency ? 'Charged waiting time: ' + data.latency + ' h\n' : ''}Price: ${data.price},00 EUR`;

        const msgServiceFlatrate = `${data.dropOffDATE && data.pickupDATE !== data.dropOffDATE ? 'Date of dropoff: ' + data.dropOffDATE + '\n' : ''}Estimated time of dropoff: ${data.dropOffTIME ? this.datetimeService.getTimeFromLanguage(data.dropOffTIME, LanguageOptions.EN) : ''}\nCharged tenancy: ${data.tenancy} h\nEstimated price: ${data.price},00 EUR`;

        return `${msgStart}\n\n${msgCustomer}\n\n${msgServiceBasic}\n${data.service === ServiceOptions.FLATRATE ? msgServiceFlatrate : msgServiceFixed}`
    }

    sendMail() {
        return this.http.post(this.urlSend, this.mailData, { observe: 'response' });        
    }
}