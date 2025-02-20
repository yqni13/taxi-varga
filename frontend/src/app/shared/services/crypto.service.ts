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
    private ivPosition: number;

    constructor() {
        this.publicKey = environment.PUBLIC_KEY;
        this.privateKey = environment.PRIVATE_KEY;
        this.ivPosition = environment.IV_POSITION;
    }

    async encryptAES(data: string): Promise<string> {
        const passphrase = 'passw0rd';
        
        // part 1: create symmetric key, iv & salt
        const salt = this.generateRandomHex(32);
        const key = await this.deriveKey(passphrase, salt);
        const iv = window.crypto.getRandomValues(new Uint8Array(16));

        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);

        
        // part 2: encryption & hide key elements as hex
        const encryptedBuffer = await window.crypto.subtle.encrypt(
            {name: "AES-CBC", iv},
            key,
            encodedData
        );

        const ivHex = this.convertUint8ArrayToHex(iv);
        const encryptedHex = this.convertUint8ArrayToHex(new Uint8Array(encryptedBuffer));

        const salt1 = salt.slice(0, this.ivPosition);
        const salt2 = salt.slice(this.ivPosition);

        return `${salt1}${ivHex}${salt2}${encryptedHex}`;
    }

    private generateRandomHex(size: number): string {
        const bytes = new Uint8Array(size);
        window.crypto.getRandomValues(bytes);
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    private convertUint8ArrayToHex(bytes: Uint8Array): string {
        return Array.from(bytes)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    }

    private async deriveKey(passphrase: string, salt: string): Promise<CryptoKey> {
        const encoder = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            encoder.encode(passphrase),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );

        return await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: encoder.encode(salt),
                iterations: 100000,
                hash: "SHA-256",
            },
            keyMaterial,
            { name: "AES-CBC", length: 256 },
            false, // true only for debugging
            ["encrypt", "decrypt"]
        );
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