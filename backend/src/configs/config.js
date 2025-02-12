module.exports.Config = {
    MODE: process.env.NODE_MODE || 'development',
    PORT: process.env.NODE_PORT || 3000,
    MAP_KEY: process.env.MAP_KEY || null,
    AUTH_ID: process.env.SECRET_AUTH_ID || null,
    AUTH_KEY: process.env.SECRET_CRYPTO_KEY || null,
    AUTH_PASS: process.env.SECRET_AUTH_PASS || null
};