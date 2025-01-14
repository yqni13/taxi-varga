const errorMiddleware = require('../middleware/error.middleware');

class MiddlewareLoader {
    static init(app) {
        app.all('*', (req, res, next) => {
            res.send('WELCOME TO TAXI-VARGA API.');
        });

        app.use(errorMiddleware);
    }
}

module.exports = { MiddlewareLoader };