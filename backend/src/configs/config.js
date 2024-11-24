module.exports.Config = {
    MODE: process.env.NODE_MODE || 'development',
    PORT: process.env.NODE_PORT || 3001,
    MAP_KEY: process.env.MAP_KEY || null
};