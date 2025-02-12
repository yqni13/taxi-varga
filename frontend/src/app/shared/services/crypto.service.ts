/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CryptoService {

    private privateKey: string;

    constructor() {
        this.privateKey = environment.PRIVATE_KEY;
    }

    encryptData(data: any): string {
        return CryptoJS.AES.encrypt(data, this.privateKey).toString();
    }

    decryptData(data: string): string {
        return CryptoJS.AES.decrypt(data, this.privateKey).toString(CryptoJS.enc.Utf8);
    }
}