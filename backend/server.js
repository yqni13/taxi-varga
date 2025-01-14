require('dotenv').config();
const { ExpressLoader } = require('./src/loaders/express.loader');
const { RoutesLoader } = require('./src/loaders/routes.loader');
const { MiddlewareLoader } = require('./src/loaders/middleware.loader');
// const https = require('https');
// const fs = require('fs');

const app = ExpressLoader.init();

const version = "v1";
RoutesLoader.initRoutes(app, version);

MiddlewareLoader.init(app);

// const options = {
//     key: fs.readFileSync("dev_ssl/be-key.pem", "utf8"),
//     cert: fs.readFileSync("dev_ssl/be-cert.pem", "utf8")
// }

// const port = process.env.PORT || 3000;
// https.createServer(options, app).listen(port, () => {
//     console.log(`LOCAL SSL SERVER ACTIVE ON PORT ${port}!`)
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`TAXI-VARGA SERVER RUNNING ON PORT: ${port}!`);
});

module.exports = app;