module.exports.Config = {
    MODE: process.env.NODE_MODE || 'development',
    PORT: process.env.NODE_PORT || 3000,
    EMAIL_SENDER: process.env.SECRET_EMAIL_SENDER || null,
    EMAIL_PASS: process.env.SECRET_EMAIL_PASS || null,
    EMAIL_RECEIVER: process.env.SECRET_EMAIL_RECEIVER || null,
    MAP_KEY: process.env.MAP_KEY || null,
    PASS_POSITION: process.env.SECRET_PASS_POS || null,
    AUTH_USER: process.env.SECRET_AUTH_USER || null,
    AUTH_ID: process.env.SECRET_AUTH_ID || null,
    AUTH_PASS: process.env.SECRET_AUTH_PASS || null,
    AUTH_KEY: process.env.SECRET_CRYPTO_KEY || null
};