# SSL Config

1. Look up "local ssl setup" on the internet for help with the local setup (due to different versions, operating systems and methods I don't suggest a certain way). Create a certificate and key (also multiple ways to do so) and config your environment respectively.
<br><br>

1. Adapt script command `start-local-ssl` within [package.json](package.json) to reference your cert and key to run the application on localhost:
```sh
node set-env.dev.ts && ng serve --ssl true --ssl-cert <your-path>/local-ssl-certificate.crt --ssl-key <your-path>/local-ssl-key.key --open
```
<br>

1. Add `proxy.conf.json` file on the root of your angular project (located besides package.json, angular.json, ...) with the content:
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


4. Due to the proxy configuration, the api call urls need to be adapted too by removing the domain added from env var (every api call). See example:
```sh
this.url = '/api/v1/auth/init';
```
instead of
```sh
this.url = `${environment.API_BASE_URL}/api/v1/auth/init`;
```
<br>

5. Finally, `server.js` for the backend must be adapted to local ssl usage:
```sh
const app = ExpressLoader.init();

const version = "v1";
RoutesLoader.initRoutes(app, version);

MiddlewareLoader.init(app);

// dev mode only
const options = {
    key: fs.readFileSync("dev_ssl/be-key.pem", "utf8"),
    cert: fs.readFileSync("dev_ssl/be-cert.pem", "utf8")
}

// dev mode only
const port = Config.PORT; 
https.createServer(options, app).listen(port, () => {
    console.log(`LOCAL SSL SERVER ACTIVE ON PORT ${port}!`)
});


// prod mode
// const port = Config.PORT;
// app.listen(port, () => {
//     console.log(`TAXI-VARGA SERVER RUNNING ON PORT: ${port}!`);
// });

module.exports = app;
```