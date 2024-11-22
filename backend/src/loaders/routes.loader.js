const drivingRouter = require('../routes/driving.routes');

class RoutesLoader {
    static initRoutes(app, version) {
        app.use(`/api/${version}/driving`, drivingRouter);
    }
}

module.exports = { RoutesLoader };