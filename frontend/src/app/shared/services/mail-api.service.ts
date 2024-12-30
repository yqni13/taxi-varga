/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class MailAPIService {
    private mailData: any;
    private url: string;

    constructor(private readonly http: HttpClient) {
        this.mailData = {
            honorifics: '',
            title: '',
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            body: ''
        }
        // TODO(yqni13): clean input before use

        this.url = environment.API_BASE_URL + '/api/v1/mailing';
    }

    setMailData(data: any) {
        this.mailData = {
            honorifics: data.honorifics,
            title: data.title,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            email: data.email,
            body: data.message
        };
    }

    private configMailData() {
        // this.mailData.subject = this.mailData.subject === SubjectOptions.artOrder 
        // ? `${this.mailData.subject}: ${this.mailData.referenceNr}`
        // : this.mailData.subject;

        // const msgPartType = this.mailData.type === ArtworkOptions.originalORprint
        //     ? `${ArtworkOptions.original} & ${ArtworkOptions.print}`
        //     : this.mailData.type;

        // const msgTitle = this.mailData.title !== ''
        //     ? `${this.mailData.title} `
        //     : ''

        // const msgArtworkData = (this.mailData.referenceNr === undefined || this.mailData.referenceNr?.length > 0)
        //     ? this.mailData.referenceNr?.toUpperCase() + `\nType: ${msgPartType}`
        //     : `--`

        // this.mailData.body = `This email was sent by: ${this.mailData.honorifics} ${msgTitle}${this.mailData.firstName} ${this.mailData.lastName}\nReference-Number: ${msgArtworkData}\n\nMessage: ${this.mailData.body}`
    }

    sendMail() {
        this.configMailData();
        return this.http.post(this.url, this.mailData, { observe: 'response' });        
    }
}