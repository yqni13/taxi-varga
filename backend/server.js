require('dotenv').config();
const { ExpressLoader } = require('./src/loaders/express.loader');
const { RoutesLoader } = require('./src/loaders/routes.loader');
const { MiddlewareLoader } = require('./src/loaders/middleware.loader');
const https = require('https');
const fs = require('fs');

const app = ExpressLoader.init();

const version = "v1";
RoutesLoader.initRoutes(app, version);

MiddlewareLoader.init(app);

const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert")
}

const port = process.env.PORT || 3000;
https.createServer(options, app).listen(port, () => {
    console.log(`Server running on port ${port}!`)
});

module.exports = app;