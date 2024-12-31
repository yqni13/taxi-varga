/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { MailingMessage, MailingRequest } from "../interfaces/mailing-request.interface";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class MailAPIService {
    private mailData: MailingRequest;
    private url: string;

    constructor(
        private readonly http: HttpClient,
        private readonly translate: TranslateService
    ) {
        this.mailData = {
            sender: '',
            subject: '',
            body: ''
        }
        // TODO(yqni13): clean input before use

        this.url = environment.API_BASE_URL + '/api/v1/mailing';
    }

    setMailData(data: MailingMessage) {

        const msgStart = `Anfrage für Service: ${this.translate.get('shared.enum.service.' + data.service)}`;

        const msgCustomer = `Daten zur Person:\n${this.translate.get('shared.enum.gender.' + data.gender)} ${data.title ? data.title + ' ' : ''}${data.firstName} ${data.lastName}\n${data.phone}\n${data.email}\n\nPersönliche Notiz:\n${data.note ? data.note : '--'}`;

        const msgServiceBasic = `Daten zum Service:\nAbholadresse: ${data.origin}\nZieladresse: ${data.destination}\n${data.service === 'destination' && data.back2home ? 'Möchte zur Abholadresse anschließend zurückgebracht werden (JA).\n' : ''}Datum der Abholung: ${data.date}\nZeitpunkt der Abholung: ${data.time}`;

        const msgServiceFixed = `Distanz: ${data.distance}\nFahrtdauer: ${data.duration}\nPreis: ${data.price}`;
        const msgServiceFlatrate = `Mietdauer: ${data.tenancy}\nGeschätzter Preis: ${data.price}`;
        
        this.mailData = {
            sender: data.email,
            subject: `Anfrage: ${data.service}`,
            body: `${msgStart}\n\n${msgCustomer}\n\n${msgServiceBasic}\n${data.service === 'flatrate' ? msgServiceFlatrate : msgServiceFixed}`
        }
    }

    sendMail() {
        return this.http.post(this.url, this.mailData, { observe: 'response' });        
    }
}