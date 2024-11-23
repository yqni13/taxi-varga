const drivingRouter = require('../routes/driving.routes');
const mailingRouter = require('../routes/mailing.routes');

class RoutesLoader {
    static initRoutes(app, version) {
        app.use(`/api/${version}/driving`, drivingRouter);
        app.use(`/api/${version}/mailing`, mailingRouter);
    }
}

module.exports = { RoutesLoader };