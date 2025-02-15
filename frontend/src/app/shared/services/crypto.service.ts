/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import * as Forge from 'node-forge';
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CryptoService {

    private publicKey: string;

    constructor() {
        this.publicKey = environment.PUBLIC_KEY;
    }

    encryptRSA(data: any): string {
        const rsa = Forge.pki.publicKeyFromPem(this.publicKey);
        const chunkSize = 86;
        let encoded = '';

        for(let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.substring(i, i + chunkSize);
            const encodedChunk = rsa.encrypt(chunk);
            encoded += Forge.util.encode64(encodedChunk);
        }

        return encoded;
    }
}