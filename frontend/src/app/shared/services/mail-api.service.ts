/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MailingMessage, MailingRequest } from "../interfaces/mailing-request.interface";
import { TranslateService } from "@ngx-translate/core";
import { DateTimeService } from "./datetime.service";
import { MailTranslateService } from "./mail-translate.service";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class MailAPIService {
    private mailData: MailingRequest;
    private urlSend: string;
    private divider: string;

    private translateData: any;

    constructor(
        private readonly http: HttpClient,
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
            destination: ''
        }

        this.divider = `
        -----------------------------------------------------
        -----------------------------------------------------
        `;
        // TODO(yqni13): clean input before use

        // this.urlSend = '/api/v1/mailing/send';
        this.urlSend = environment.API_BASE_URL + '/api/v1/mailing/send';
    }

    setMailData(data: MailingMessage) {

        data.phone = this.removeEmptySpacesInString(data.phone);

        // german version
        const declareGerman = 'Deutsche Version';
        const declareEnglish = 'English version';

        const hasLatency = data.latency ? this.datetimeService.getTimeInTotalMinutes(data.latency) > 0 : false;
        
        const bodyInGerman = this.configEmailBodyDE(data, hasLatency);
        const bodyInEnglish = this.configEmailBodyEN(data, hasLatency);

        this.mailData = {
            sender: data.email,
            subject: `Anfrage/Request: Taxi-Varga Service`,
            body: `${declareGerman}\n${bodyInGerman}\n\n${this.divider}\n\n${declareEnglish}\n${bodyInEnglish}`
        };
    }

    configEmailBodyDE(data: MailingMessage, hasLatency: boolean): string {
        this.translateData.origin = data.service === 'airport' && data.airport === 'arrival'
            ? this.mailTranslateService.getTranslationDE('modules.service.content.airport.vie-schwechat')
            : data.originAddress;
        this.translateData.destination = data.service === 'airport' && data.airport === 'departure'
            ? this.mailTranslateService.getTranslationDE('modules.service.content.airport.vie-schwechat')
            : data.destinationAddress;
        this.translateData.service = this.mailTranslateService.getTranslationDE(`shared.enum.service.${data.service}`);
        this.translateData.gender = this.mailTranslateService.getTranslationDE(`shared.enum.gender.${data.gender}`);

        const msgStart = `Anfrage für Service: ${this.translateData.service}`;

        const msgCustomer = `Daten zur Person:\n${this.translateData.gender} ${data.title ? data.title + ' ' : ''}${data.firstName} ${data.lastName}\n${data.phone}\n${data.email}\nPersönliche Notiz:\n${data.note ? '"' + data.note + '"' : '--'}`;

        const msgServiceBasic = `Daten zum Service:\nAbholadresse: ${this.translateData.origin}\nZieladresse: ${this.translateData.destination}\n${data.service === 'destination' && data.back2home ? 'Rückkehradresse: ' + data.originAddress + '\n' : ''}Datum der Abholung: ${data.pickupDATE}\nZeitpunkt der Abholung: ${data.pickupTIME} Uhr`;

        const msgServiceFixed = `Fahrtstrecke: ${data.distance} km\nFahrtdauer: ${data.duration} h\n${hasLatency ? 'Verrechnete Wartezeit: ' + data.latency + ' h\n' : ''}Preis: ${data.price},00 EUR`;

        const msgServiceFlatrate = `${data.dropOffDATE && data.pickupDATE !== data.dropOffDATE ? 'Datum der Ankunft: ' + data.dropOffDATE + '\n' : ''}Geschätzte Zeit der Ankunft: ${data.dropOffTIME} Uhr\nVerrechnete Mietdauer: ${data.tenancy} h\nGeschätzter Preis: ${data.price},00 EUR`;

        return `${msgStart}\n\n${msgCustomer}\n\n${msgServiceBasic}\n${data.service === 'flatrate' ? msgServiceFlatrate : msgServiceFixed}`
    }
    
    configEmailBodyEN(data: MailingMessage, hasLatency: boolean): string {        
        this.translateData.origin = data.service === 'airport' && data.airport === 'arrival'
            ? this.mailTranslateService.getTranslationEN('modules.service.content.airport.vie-schwechat')
            : data.originAddress;
        this.translateData.destination = data.service === 'airport' && data.airport === 'departure'
            ? this.mailTranslateService.getTranslationEN('modules.service.content.airport.vie-schwechat')
            : data.destinationAddress;   
        this.translateData.service = this.mailTranslateService.getTranslationEN(`shared.enum.service.${data.service}`);
        this.translateData.gender = this.mailTranslateService.getTranslationEN(`shared.enum.gender.${data.gender}`);

        const msgStart = `Request for service: ${this.translateData.service}`;

        const msgCustomer = `Customer data:\n${this.translateData.gender} ${data.title ? data.title + ' ' : ''}${data.firstName} ${data.lastName}\n${data.phone}\n${data.email}\nCustomer note:\n${data.note ? '"' + data.note + '"' : '--'}`;

        const msgServiceBasic = `Service data:\nPickup address: ${this.translateData.origin}\nDestination address: ${this.translateData.destination}\n${data.service === 'destination' && data.back2home ? 'Return address: ' + data.originAddress + '\n' : ''}Date of pickup: ${data.pickupDATE}\nTime of pickup: ${this.datetimeService.getTimeFromLanguage(data.pickupTIME, 'en')}`;

        const msgServiceFixed = `Distance: ${data.distance} km\nDuration: ${data.duration} h\n${hasLatency ? 'Charged waiting time: ' + data.latency + ' h\n' : ''}Price: ${data.price},00 EUR`;

        const msgServiceFlatrate = `${data.dropOffDATE && data.pickupDATE !== data.dropOffDATE ? 'Date of dropoff: ' + data.dropOffDATE + '\n' : ''}Estimated time of dropoff: ${data.dropOffTIME ? this.datetimeService.getTimeFromLanguage(data.dropOffTIME, 'en') : ''}\nCharged tenancy: ${data.tenancy} h\nEstimated price: ${data.price},00 EUR`;

        return `${msgStart}\n\n${msgCustomer}\n\n${msgServiceBasic}\n${data.service === 'flatrate' ? msgServiceFlatrate : msgServiceFixed}`
    }

    removeEmptySpacesInString(text: string): string {
        return text.replaceAll(' ', '');
    }

    sendMail() {
        return this.http.post(this.urlSend, this.mailData, { observe: 'response' });        
    }
}