/* eslint-disable @typescript-eslint/prefer-for-of */
import { Injectable } from "@angular/core";
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

    // TODO(yqni13): clean after decision for what to keep

    // encryptRSA(data: any): string {
    //     // convert PEM-encoded key to format suitable to handle
    //     const rsa = Forge.pki.publicKeyFromPem(this.publicKey);
    //     const chunkSize = 86;

    //     // encrypt single chunks with RSA key 
    //     // format from binary data to string (base64 format)
    //     // append chunks together for final result
    //     let encoded = '';
    //     for(let i = 0; i < data.length; i += chunkSize) {
    //         const chunk = data.substring(i, i + chunkSize);
    //         const encodedChunk = rsa.encrypt(chunk);
    //         encoded += Forge.util.encode64(encodedChunk);
    //     }

    //     return encoded;
    // }

    // decryptRSA(data: any): string  {
    //     // convert formats to handle (key) or decrypt (string -> bytes)
    //     const rsa = Forge.pki.privateKeyFromPem(this.privateKey);
    //     const ctBytes = Forge.util.decode64(data);
        
    //     // decrypt value and make readable
    //     const plaintextBytes = rsa.decrypt(ctBytes);
    //     return plaintextBytes.toString();
    // }


    // alternative solutions without node-forge lib
    async encryptRSA(data: string): Promise<string> {
        const publicKey = await this.importPublicKey(this.publicKey);
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);
    
        const encrypted = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP"
            },
            publicKey,
            encodedData
        );
    
        return this.arrayBufferToBase64(encrypted);
    }
    
    async decryptRSA(data: string): Promise<string> {
        const privateKey = await this.importPrivateKey(this.privateKey);
        const encryptedData = this.base64ToArrayBuffer(data);
    
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            privateKey,
            encryptedData
        );
    
        const decoder = new TextDecoder();
        const result = decoder.decode(decrypted);
        return result;
    }
    
    private async importPublicKey(pem: string): Promise<CryptoKey> {
        const binaryDer = this.pemToArrayBuffer(pem);
        return await window.crypto.subtle.importKey(
            "spki",
            binaryDer,
            {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            true,
            ["encrypt"]
        );
    }
    
    private async importPrivateKey(pem: string): Promise<CryptoKey> {
        const binaryDer = this.pemToArrayBuffer(pem);
        return await window.crypto.subtle.importKey(
            "pkcs8",
            binaryDer,
            {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            true,
            ["decrypt"]
        );
    }
    
    private pemToArrayBuffer(pem: string): ArrayBuffer {
        const base64String = pem.replace(/-----[A-Z ]+-----/g, "").replace(/\s+/g, "");
        return this.base64ToArrayBuffer(base64String);
    }
    
    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
    
    private base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }
}