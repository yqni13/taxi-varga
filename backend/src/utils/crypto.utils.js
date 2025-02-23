const forge = require('node-forge');
const crypto = require('crypto');

// RSA
// exports.decryptRSA = (data, privateKey) => {
//     // convert formats to handle (key) or decrypt (string -> bytes)
//     const rsa = forge.pki.privateKeyFromPem(privateKey);
//     const ctBytes = forge.util.decode64(data);
    
//     // decrypt value and make readable
//     const plaintextBytes = rsa.decrypt(ctBytes);
//     return plaintextBytes.toString();
// }

// exports.encryptRSA = (data, publicKey) => {
//     // convert PEM-encoded key to format suitable to handle
//     const rsa = forge.pki.publicKeyFromPem(publicKey);
//     const chunkSize = 86;

//     // encrypt single chunks with RSA key 
//     // format from binary data to string (base64 format)
//     // append chunks together for final result
//     let encoded = '';
//     for(let i = 0; i < data.length; i += chunkSize) {
//         const chunk = data.substring(i, i + chunkSize);
//         const encodedChunk = rsa.encrypt(chunk);
//         encoded += forge.util.encode64(encodedChunk);
//     }

//     return encoded;
// }

// AES
exports.decryptAES = async (data, ivPosition) => {
    const passphrase = 'passw0rd';

    // part 1: split iv, key and encrypted text from data
    const salt1 = data.slice(0, ivPosition);
    const salt2 = data.slice(ivPosition + 32, 96);
    const salt = salt1 + salt2;
    const ivHex = data.slice(ivPosition, ivPosition + 32);
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedBuffer = Buffer.from(data.slice(32+64), 'hex');
    
    // part 2: derive key
    const key = crypto.pbkdf2Sync(passphrase, Buffer.from(salt, 'utf8'), 100000, 32, 'sha256');
    
    // part 3: decrypt
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted += decipher.final('utf8');

    return decrypted;
}

// ##############################################################################
// ##############################################################################

// solution alligning with client-sided encryption (new version due to problems with node-forge lib)
exports.encryptRSA = (data, publicKey) => {
    const buffer = Buffer.from(data, "utf8");
    const encrypted = crypto.publicEncrypt(
    {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
    },
    buffer
    );

    return encrypted.toString("base64");
}

exports.decryptRSA = (data, privateKey) => {
    const buffer = Buffer.from(data, "base64");
    const decrypted = crypto.privateDecrypt(
    {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
    },
    buffer
    );

    return decrypted.toString("utf8");
}


// TODO(yqni13): clean after decision for what to keep
// ##############################################################################
// ##############################################################################

// exports.encryptRSA = async (data, key) => {
//     const publicKey = await this.importPublicKey(key);
//     const encoder = new TextEncoder();
//     const encodedData = encoder.encode(data);

//     const encrypted = await window.crypto.subtle.encrypt(
//         {
//             name: "RSA-OAEP"
//         },
//         publicKey,
//         encodedData
//     );

//     return this.arrayBufferToBase64(encrypted);
// }

// exports.decryptRSA = async (data, key) => {
//     const privateKey = await this.importPrivateKey(key);
//     const encryptedData = this.base64ToArrayBuffer(data);

//     const decrypted = await window.crypto.subtle.decrypt(
//         {
//             name: "RSA-OAEP"
//         },
//         privateKey,
//         encryptedData
//     );

//     const decoder = new TextDecoder();
//     return decoder.decode(decrypted);
// }

// exports.importPublicKey = async (pem) => {
//     const binaryDer = this.pemToArrayBuffer(pem);
//     return await window.crypto.subtle.importKey(
//         "spki",
//         binaryDer,
//         {
//             name: "RSA-OAEP",
//             hash: "SHA-256"
//         },
//         true,
//         ["encrypt"]
//     );
// }

// exports.importPrivateKey = async (pem) => {
//     const binaryDer = this.pemToArrayBuffer(pem);
//     return await window.crypto.subtle.importKey(
//         "pkcs8",
//         binaryDer,
//         {
//             name: "RSA-OAEP",
//             hash: "SHA-256"
//         },
//         true,
//         ["decrypt"]
//     );
// }

// exports.pemToArrayBuffer = (pem) => {
//     const base64String = pem.replace(/-----[A-Z ]+-----/g, "").replace(/\s+/g, "");
//     return this.base64ToArrayBuffer(base64String);
// }

// exports.arrayBufferToBase64 = (buffer) => {
//     let binary = "";
//     const bytes = new Uint8Array(buffer);
//     for (let i = 0; i < bytes.length; i++) {
//         binary += String.fromCharCode(bytes[i]);
//     }
//     return btoa(binary);
// }

// exports.base64ToArrayBuffer = (base64) => {
//     const binary = atob(base64);
//     const bytes = new Uint8Array(binary.length);
//     for (let i = 0; i < binary.length; i++) {
//         bytes[i] = binary.charCodeAt(i);
//     }
//     return bytes.buffer;
// }