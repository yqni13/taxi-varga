const calcAtoBRouter = require('../routes/calcAtoB.routes');

class RoutesLoader {
    static initRoutes(app, version) {
        app.use(`/api/${version}/calcAtoB`, calcAtoBRouter);
    }
}

module.exports = { RoutesLoader };