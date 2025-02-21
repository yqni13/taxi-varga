const forge = require('node-forge');
const crypto = require('crypto');

// RSA
exports.decryptRSA = (data, privateKey) => {
    // convert formats to handle (key) or decrypt (string -> bytes)
    const rsa = forge.pki.privateKeyFromPem(privateKey);
    const ctBytes = forge.util.decode64(data);
    
    // decrypt value and make readable
    const plaintextBytes = rsa.decrypt(ctBytes);
    return plaintextBytes.toString();
}

exports.encryptRSA = (data, publicKey) => {
    // convert PEM-encoded key to format suitable to handle
    const rsa = forge.pki.publicKeyFromPem(publicKey);
    const chunkSize = 86;

    // encrypt single chunks with RSA key 
    // format from binary data to string (base64 format)
    // append chunks together for final result
    let encoded = '';
    for(let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.substring(i, i + chunkSize);
        const encodedChunk = rsa.encrypt(chunk);
        encoded += forge.util.encode64(encodedChunk);
    }

    return encoded;
}

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

