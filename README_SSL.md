# SSL Config

### Preparations

Look up "local SSL setup" on the internet for help with the local setup (due to different versions, operating systems and methods I don't suggest a certain way). Create a certificate and key (also multiple ways to do so) and configure your environment respectively.
<br><br>

### package.json

Adapt script command `start-local-ssl` within [package.json](package.json) to ignore errors status 0 (self-signed certificate), set env-variables and reference your cert and key to run the application on localhost (env:development):
```sh
cross-env NODE_TLS_REJECT_UNAUTHORIZED=0 cmd /c \"node ./set-env.dev.ts && ng serve --ssl true --ssl-cert D:/Dokumente/GitHub/taxi-varga/local_ssl/localhost.crt --ssl-key D:/Dokumente/GitHub/taxi-varga/local_ssl/localhost.key --open\"
```
`cross-env`: sets and uses environment variables across platforms/shells<br>
`cmd /c`: use Windows-Shell (explicit useage can help because cross-env, npm and node are not guaranteed to use the same shell) and flag /c shows following as command to execute
<br><br>

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
Due to the proxy configuration, the api call urls need to be adapted too by removing the domain added from env var (every API call). See example:
```sh
this.url = '/api/v1/auth/init';
```
instead of
```sh
this.url = `${environment.API_BASE_URL}/api/v1/auth/init`;
```
<br>

### server.js

Finally, `server.js` for the backend must be adapted to local SSL usage:
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