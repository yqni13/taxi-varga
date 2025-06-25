const { ExpressLoader } = require('./loaders/express.loader');
const { RoutesLoader } = require('./loaders/routes.loader');
const { MiddlewareLoader } = require('./loaders/middleware.loader');

const app = ExpressLoader.init();
const version = "v1";

RoutesLoader.initRoutes(app, version);
MiddlewareLoader.init(app);

module.exports = app;