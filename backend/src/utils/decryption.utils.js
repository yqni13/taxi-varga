const forge = require('node-forge');

exports.decryptionRSA = (value, privateKey) => {
    // convert formats to handle (key) or decrypt (string -> bytes)
    const rsa = forge.pki.privateKeyFromPem(privateKey);
    let ctBytes = forge.util.decode64(value);
    
    // decrypt value and make readable
    let plaintextBytes = rsa.decrypt(ctBytes);
    return plaintextBytes.toString();
}