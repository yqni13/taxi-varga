/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import * as Forge from 'node-forge';
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CryptoService {

    private publicKey: string;
    private privateKey: string;

    constructor() {
        this.publicKey = environment.PUBLIC_KEY;
        this.privateKey = '';
    }

    encryptRSA(data: any): string {
        // convert PEM-encoded key to format suitable to handle
        const rsa = Forge.pki.publicKeyFromPem(this.publicKey);
        const chunkSize = 86;

        // encrypt single chunks with RSA key 
        // format from binary data to string (base64 format)
        // append chunks together for final result
        let encoded = '';
        for(let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.substring(i, i + chunkSize);
            const encodedChunk = rsa.encrypt(chunk);
            encoded += Forge.util.encode64(encodedChunk);
        }

        return encoded;
    }

    decryptRSA(data: any): string  {
        // convert formats to handle (key) or decrypt (string -> bytes)
        const rsa = Forge.pki.privateKeyFromPem(this.privateKey);
        const ctBytes = Forge.util.decode64(data);
        
        // decrypt value and make readable
        const plaintextBytes = rsa.decrypt(ctBytes);
        return plaintextBytes.toString();
    }
}