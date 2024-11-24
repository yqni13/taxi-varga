require('dotenv').config();
const { ExpressLoader } = require('./src/loaders/express.loader');
const { RoutesLoader } = require('./src/loaders/routes.loader');
const { MiddlewareLoader } = require('./src/loaders/middleware.loader');

const app = ExpressLoader.init();

const version = "v1";
RoutesLoader.initRoutes(app, version);

MiddlewareLoader.init(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}!`)
});

module.exports = app;