const addressRouter = require('../routes/address.routes');
const authRouter = require('../routes/auth.routes');
const drivingRouter = require('../routes/driving.routes');
const mailingRouter = require('../routes/mailing.routes');
const metaRouter = require('../routes/meta.routes');


class RoutesLoader {
    static initRoutes(app, version) {
        app.use(`/api/${version}/address`, addressRouter);
        app.use(`/api/${version}/auth`, authRouter);
        app.use(`/api/${version}/driving`, drivingRouter);
        app.use(`/api/${version}/mailing`, mailingRouter);
        app.use(`/api/${version}/meta`, metaRouter);
    }
}

module.exports = { RoutesLoader };