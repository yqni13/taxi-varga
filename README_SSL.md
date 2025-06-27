# SSL Config

### Preparations

Look up "local ssl setup" on the internet for help with the local setup (due to different versions, operating systems and methods I don't suggest a certain way). Create a certificate and key (also multiple ways to do so) and config your environment respectively.
<br><br>

### package.json

Adapt script command `start-local-ssl` within [package.json](package.json) to reference your cert and key to run the application on localhost:
```sh
node set-env.dev.ts && ng serve --ssl true --ssl-cert <your-path>/local-ssl-certificate.crt --ssl-key <your-path>/local-ssl-key.key --open
```
<br>

### Proxy setting

Add `proxy.conf.json` file on the root of your angular project (located besides package.json, angular.json, ...) with the content:
```sh
    {
        "/api": {
            "target": "https://localhost:3000",
            "secure": false
        }
    }
```
which also needs to be entered in angular.json on path "architect/serve/" as:
```sh
    "options": {
        "proxyConfig": "proxy.conf.json"
    }
```
<br>

### API url's
Due to the proxy configuration, the api call urls need to be adapted too by removing the domain added from env var (every api call). See example:
```sh
this.url = '/api/v1/auth/init';
```
instead of
```sh
this.url = `${environment.API_BASE_URL}/api/v1/auth/init`;
```
<br>

### server.js

Finally, `server.js` for the backend must be adapted to local ssl usage:
```sh
require('dotenv').config();
const { Config } = require('./src/configs/config');
const app = require('./src/app');
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync("dev_ssl/be-key.pem", "utf8"),
    cert: fs.readFileSync("dev_ssl/be-cert.pem", "utf8")
}

const port = Config.PORT;
https.createServer(options, app).listen(port, () => {
    console.log(`LOCAL SSL SERVER ACTIVE ON PORT ${port}!`)
});

// const port = Config.PORT;
// app.listen(port, () => {
//     console.log(`TAXI-VARGA SERVER RUNNING ON PORT: ${port}!`);
// });
```