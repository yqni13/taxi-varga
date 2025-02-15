const forge = require('node-forge');

exports.decryptionRSA = (value, privateKey) => {
    const rsa = forge.pki.privateKeyFromPem(privateKey);
    let ctBytes = forge.util.decode64(value);
    let plaintextBytes = rsa.decrypt(ctBytes);
    return plaintextBytes.toString();
}