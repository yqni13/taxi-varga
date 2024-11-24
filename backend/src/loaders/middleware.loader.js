const { InvalidEndpointException } = require('../utils/exceptions/api.exception');
const errorMiddleware = require('../middleware/error.middleware');

class MiddlewareLoader {
    static init(app) {
        app.all('*', (req, res, next) => {
            const err = new InvalidEndpointException();
            next(err);
        });

        app.use(errorMiddleware);
    }
}

module.exports = { MiddlewareLoader };