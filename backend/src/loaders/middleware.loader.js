const errorMiddleware = require('../middleware/error.middleware');
const { Config } = require('../configs/config');

class MiddlewareLoader {
    static init(app) {
        app.all('*', (req, res, next) => {
            res.send(`SERVER: TAXI-VARGA.\nMODE: ${String(Config.MODE).toUpperCase()}.\nSTATUS: ACTIVE.`);
        });

        app.use(errorMiddleware);
    }
}

module.exports = { MiddlewareLoader };